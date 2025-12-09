import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: [
			"http://localhost:8080",
			"https://checkout.thewell.solutions"
		],
		credentials: true,
	},
	namespace: 'payments'
})
export class PaymentGateway {
	@WebSocketServer()
	server: Server;
	private readonly logger = new Logger(PaymentGateway.name);

	handleConnection(client: Socket) {
		this.logger.log('Client connected to payments namespace');
		client.on('join', (data: { recordID: string }) => {
			if (data?.recordID) {
				this.logger.log('Room joined: ' + data.recordID);
				client.join(data.recordID);
			}
		});
	}

	emitPaymentErrorToRecord(recordID: string, data: { paymentId: string; error: string }) {
		this.server.to(recordID).emit('payment_failed', data);
	}

	emitPaymentSucceededToRecord(recordID: string, data: { paymentId: string }) {
		this.server.to(recordID).emit('payment_succeeded', data);
	}
}