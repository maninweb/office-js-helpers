/* Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. */
import { MessageBanner, IMessageBannerParams } from './message-banner/message-banner';

const DEFAULT_WHITESPACE = 2;

export class UI {
  /** Shows a basic notification at the top of the page
   * @param message - body of the notification
   */
  static notify(message: string);

  /** Shows a basic notification with a custom title at the top of the page
   * @param message - body of the notification
   * @param title - title of the notification
   */
  static notify(message: string, title: string);

  /** Shows a basic notification at the top of the page, with a background color set based on the type parameter
   * @param message - body of the notification
   * @param title - title of the notification
   * @param type - type of the notification - see https://dev.office.com/fabric-js/Components/MessageBar/MessageBar.html#Variants
   */
  static notify(message: string, title: string, type: 'default' | 'success' | 'error' | 'warning' | 'severe-warning');

  /** Shows a basic error notification at the top of the page
   * @param error - Error object
   */
  static notify(error: Error);

  /** Shows a basic error notification with a custom title at the top of the page
   * @param title - Title, bolded
   * @param error - Error object
   */
  static notify(error: Error, title: string);

  static notify(...args: any[]) {
    const params = _parseNotificationParams(args);
    if (params == null) {
      console.error(new Error('Invalid params. Cannot create a notification'));
      return null;
    }

    return new MessageBanner(params);
  }
}

function _parseNotificationParams(params: any[]): IMessageBannerParams {
  if (params == null) {
    return null;
  }

  const [body, title, type] = params;
  if (body instanceof Error) {
    let details = '';
    const { innerError, stack } = body as any;
    if (innerError) {
      let error = JSON.stringify(innerError.debugInfo || innerError, null, DEFAULT_WHITESPACE);
      details += `Inner Error: \n${error}\n`;
    }
    if (stack) {
      details += `Stack Trace: \n${body.stack}\n`;
    }
    return {
      message: body.message,
      title: title || body.name,
      type: 'error',
      details: details
    };
  } else if (body instanceof String) {
    return {
      message: body as string,
      title,
      type: type || 'default',
      details: null
    };
  } else {
    return {
      type: 'default',
      details: JSON.stringify(body, null, DEFAULT_WHITESPACE)
    };
  }
}


