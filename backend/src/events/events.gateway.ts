import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'net';
import { UserService } from 'src/user/user.service';



@WebSocketGateway({
  namespace:'shopping',
  cors:{origin:'http://localhost:3000'}
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(private userService:UserService) {}
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  @WebSocketServer() server:Server;
  private logger: Logger = new Logger('EventsGateway');

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data:string) : string{
    return data;
  }

  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }

  @SubscribeMessage('verifyToken')
  async handleVerifyToken(socket:Socket, token:string){
    try{
      const user = await this.userService.checkingToken(token,'Secret1234');
      this.server.emit('userInfo',user);
    }catch(error){
      console.error('토큰 검증 에러',error);
      this.server.emit('tokenError', {message:'토큰 검증 실패'});
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client}`);
  }
}
