export class CreateUserDto {
  name!: string;
  email!: string;
  role!: 'STUDENT' | 'STAFF' | 'ADMIN';
}
