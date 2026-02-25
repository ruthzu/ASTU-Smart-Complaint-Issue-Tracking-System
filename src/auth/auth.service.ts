import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
	) {}

	async register(registerDto: RegisterDto) {
		const { name, email, password, role } = registerDto;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await this.prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role,
			},
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;
		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const passwordValid = await bcrypt.compare(password, user.password);
		if (!passwordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { sub: user.id, email: user.email, role: user.role };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
