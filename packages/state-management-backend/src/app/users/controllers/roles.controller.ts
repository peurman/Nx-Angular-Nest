import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RolesService } from '../services/role.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Authorized } from '../../auth/decorator/authorized.decorator';
import { ValidRoles } from '../../auth/interfaces/valid-roles.type';

@UseGuards(JwtAuthGuard)
@Authorized(ValidRoles.admin)
@Controller({
  path: 'roles',
  version: '1',
})
export class RoleController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  getRoles() {
    return this.rolesService.get();
  }

  @Put(':roleId')
  changeRole(@Param('roleId') roleId: string, @Body() dto: CreateRoleDto) {
    return this.rolesService.modify(roleId, dto);
  }

  @Delete(':roleId')
  deleteRole(@Param('roleId') roleId: string) {
    return this.rolesService.delete(roleId);
  }
}
