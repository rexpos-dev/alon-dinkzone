import { Injectable, Logger } from '@nestjs/common';

/**
 * Stub notifications service. Phase 1 wires this to FCM/APNs
 * (see Technical Architecture doc §8) for:
 *  - RSVP reminders
 *  - Waitlist promotion alerts
 *  - Event starting soon / schedule changes
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendToUser(userId: string, title: string, body: string) {
    // TODO: integrate FCM/APNs. For now, just log so the call sites
    // (RSVP, waitlist promotion, event reminders) are already wired.
    this.logger.log(`[notify] -> ${userId}: ${title} - ${body}`);
  }
}
