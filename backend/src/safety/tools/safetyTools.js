import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export const sendAlertToSecurity = tool(
  async ({ issue, recommendation }) => {
    // In a real application, this would trigger a notification service (e.g., Twilio, SendGrid)
    // For now, it returns a JSON object to simulate the action.
    const response = {
      tool: 'sendAlertToSecurity',
      status: 'SUCCESS',
      message: 'Alert successfully sent to event security.',
      details: {
        issue,
        recommendation,
      },
    };
    return JSON.stringify(response);
  },
  {
    name: 'sendAlertToSecurity',
    description: 'Use this tool to alert event security about crowd control issues, physical threats, or potential dangers.',
    schema: z.object({
      issue: z.string().describe('A concise description of the security issue detected. For example, "Overcrowding at Gate 4".'),
      recommendation: z.string().describe('A clear, actionable recommendation for the security team. For example, "Redirect attendees to Gate 7 immediately."'),
    }),
  }
);

export const notifyEmergencyServices = tool(
  async ({ service, location, details }) => {
    // In a real application, this would call a 911/112 API or a dedicated emergency dispatch service.
    const response = {
      tool: 'notifyEmergencyServices',
      status: 'SUCCESS',
      message: `Emergency services (${service}) have been notified.`,
      details: {
        service,
        location,
        details,
      },
    };
    return JSON.stringify(response);
  },
  {
    name: 'notifyEmergencyServices',
    description: 'Use this tool to dispatch emergency services like medical, fire, or police for urgent, life-threatening situations.',
    schema: z.object({
      service: z.enum(['medical', 'fire', 'police']).describe('The type of emergency service required.'),
      location: z.string().describe('The precise location of the emergency within the event. For example, "Near the main stage, left side."'),
      details: z.string().describe('A brief summary of the emergency. For example, "User reported a person has collapsed and is unresponsive."'),
    }),
  }
);

export const makePublicAnnouncement = tool(
  async ({ message, targetAudience }) => {
    // In a real application, this would integrate with the event's public address system or a mass notification app.
    const response = {
      tool: 'makePublicAnnouncement',
      status: 'SUCCESS',
      message: 'Public announcement has been broadcast.',
      details: {
        message,
        targetAudience,
      },
    };
    return JSON.stringify(response);
  },
  {
    name: 'makePublicAnnouncement',
    description: 'Use this tool to make a public announcement to event attendees. Use for general safety information, not for dispatching responders.',
    schema: z.object({
      message: z.string().describe('The exact message to be announced to the public. For example, "Attention: The fireworks display will begin in 15 minutes."'),
      targetAudience: z.string().default('all').describe('The target audience for the announcement, e.g., "all", "attendees near Gate 3".'),
    }),
  }
);
