import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(user: RegisterDto) {
    const { email, password, role } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.create(email, hashedPassword, role);

    const emailToken = await this.jwtService.signAsync(
      { sub: newUser?.id, email: newUser.email, token_use: 'email_verify' },
      {
        secret: process.env.JWT_EMAIL_SECRET!,
        expiresIn: '15m',
      },
    );

    const verifyUrl = `${process.env.API_BASE_URL}/api/v1/auth/verify-email?token=${encodeURIComponent(emailToken)}`;

    await this.mailService.sendEmailVerification(newUser.email, verifyUrl);

    const { accessToken, refreshToken } = await this.generateTokens(
      newUser.id,
      newUser.email,
      newUser.role,
    );

    return {
      user: {
        id: newUser?.id,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async resendVerification(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified) {
      return { message: 'Email already verified' };
    }

    const emailToken = await this.jwtService.signAsync(
      { sub: user?.id, email: user.email, token_use: 'email_verify' },
      {
        secret: process.env.JWT_EMAIL_SECRET!,
        expiresIn: '15m',
      },
    );

    const verifyUrl = `${process.env.API_BASE_URL}/api/v1/auth/verify-email?token=${encodeURIComponent(emailToken)}`;

    await this.mailService.sendEmailVerification(user.email, verifyUrl);

    return { message: 'Verification email resent successfully' };
  }

  async verifyEmail(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_EMAIL_SECRET!,
      });

      if (decoded.token_use !== 'email_verify') {
        throw new ForbiddenException('Invalid verification token type');
      }

      const user = await this.userService.findById(decoded.sub);
      if (!user) throw new BadRequestException('User not found');
      if (user.isEmailVerified) {
        return { message: 'Email already verified' };
      }

      await this.userService.markEmailVerified(user.id);

      return { message: 'Email verified successfully' };
    } catch {
      throw new ForbiddenException('Invalid or expired verification link');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const resetToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, token_use: 'password_reset' },
      {
        secret: process.env.JWT_PASSWORD_RESET_SECRET!,
        expiresIn: '15m',
      },
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
    await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_PASSWORD_RESET_SECRET!,
      });

      if (decoded.token_use !== 'password_reset') {
        throw new ForbiddenException('Invalid password reset token type');
      }

      const user = await this.userService.findById(decoded.sub);
      if (!user) throw new BadRequestException('User not found');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.userService['userRepository'].save(user);

      return { message: 'Password reset successfully' };
    } catch {
      throw new ForbiddenException('Invalid or expired password reset link');
    }
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser) {
      throw new NotFoundException('No User with email exists');
    }

    const passwordMatches = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!passwordMatches) {
      throw new NotFoundException('Invalid credentials, Review and try again');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      existingUser.id,
      existingUser.email,
      existingUser.role,
    );

    return {
      user: {
        id: existingUser?.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async getUserDetails(userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
  }

  async refreshTokens(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET!,
    });

    const { accessToken, refreshToken } = await this.generateTokens(
      decoded.sub,
      decoded.email,
      decoded.role,
    );

    return { accessToken, refreshToken };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  validateToken(token: string): User | null {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      } as User;
    } catch (error) {
      return null;
    }
  }
}
