import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './graphql/models/User';
import { UserSetting } from './graphql/models/UserSetting';
import { UserModule } from './graphql/modules/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'src/schema.gql',
      formatError: (error) => {
        const exception =
          (error.extensions?.originalError as Record<string, any>) ||
          (error.extensions?.exception as Record<string, any>) ||
          {};

        const statusCode = exception.statusCode || exception.status || 500;

        // Map known HTTP status codes to meaningful GraphQL codes
        const statusCodeToCode: Record<number, string> = {
          400: 'BAD_REQUEST',
          401: 'UNAUTHORIZED',
          403: 'FORBIDDEN',
          404: 'NOT_FOUND',
          409: 'CONFLICT',
          422: 'UNPROCESSABLE_ENTITY',
          500: 'INTERNAL_SERVER_ERROR',
        };

        return {
          message: error.message || 'Unexpected error occurred',
          statusCode,
          code: statusCodeToCode[statusCode] || 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
          path: error.path,
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'graphql_db',
      entities: [User, UserSetting],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
