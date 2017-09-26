import { Utilities, PlatformType } from '../../helpers/utilities';


const MESSAGE_BANNER_BASE_CLASS = 'ojh-notification';

const MESSAGE_BANNER_TEMPLATE =
  `<div class="${MESSAGE_BANNER_BASE_CLASS} ms-font-m ms-MessageBar">
    <button class="${MESSAGE_BANNER_BASE_CLASS}-close"><i class="ms-Icon ms-Icon--Clear"></i></button>
    <button class="${MESSAGE_BANNER_BASE_CLASS}-expand"><i class="ms-Icon ms-Icon--ChevronDown"></i></button>
    <h4 class="${MESSAGE_BANNER_BASE_CLASS}-title ms-fontWeight-semibold">@@TITLE</h4>
    <p class="${MESSAGE_BANNER_BASE_CLASS}-message">@@MESSAGE<p>
    <pre class="${MESSAGE_BANNER_BASE_CLASS}-details">@@DETAILS<pre>
  </div>`;

const MESSAGE_BANNER_CLASSES = {
  'success': 'ms-MessageBar--success',
  'error': 'ms-MessageBar--error',
  'warning': 'ms-MessageBar--warning',
  'severe-warning': 'ms-MessageBar--severeWarning'
};

export interface IMessageBannerParams {
  title?: string;
  message?: string;
  type: 'default' | 'success' | 'error' | 'warning' | 'severe-warning';
  details?: string;
}

export class MessageBanner {
  static current: Element;

  constructor(params: IMessageBannerParams) {
    this.dismiss();

    const messageBarTypeClass = MESSAGE_BANNER_CLASSES[params.type] || '';

    let personalityMenuModifier = '';
    switch (Utilities.platform) {
      case PlatformType.PC:
        personalityMenuModifier = 'ojh-notification-button-pc';
        break;

      case PlatformType.MAC:
        personalityMenuModifier = 'ojh-notification-button-osx';
        break;
    }

    let messageBannerTemplate = MESSAGE_BANNER_TEMPLATE.replace('@@TITLE', params.title);
    messageBannerTemplate = MESSAGE_BANNER_TEMPLATE.replace('@@MESSAGE', params.message);
    messageBannerTemplate = MESSAGE_BANNER_TEMPLATE.replace('@@DETAILS', params.details);
    this._create(messageBannerTemplate, messageBarTypeClass, personalityMenuModifier);
  }

  dismiss() {
    if (MessageBanner.current) {
      MessageBanner.current.querySelector(`${MESSAGE_BANNER_BASE_CLASS}-expand`).removeEventListener('click', this._expandHandler);
      MessageBanner.current.querySelector(`${MESSAGE_BANNER_BASE_CLASS}-close`).removeEventListener('click', this._closeHandler);
      document.removeChild(MessageBanner.current);
    }
    MessageBanner.current = null;
  }

  private _create(messageBannerTemplate: string, messageBarTypeClass: string = '', personalityMenuModifier: string = '') {
    const div = document.createElement('div');
    div.insertAdjacentHTML('afterbegin', messageBannerTemplate);
    const messageBanner: Element = div.firstChild as Element;
    messageBanner.classList.add(messageBarTypeClass, personalityMenuModifier);
    messageBanner.querySelector(`${MESSAGE_BANNER_BASE_CLASS}-expand`).addEventListener('click', this._expandHandler.bind(this));
    messageBanner.querySelector(`${MESSAGE_BANNER_BASE_CLASS}-close`).addEventListener('click', this._closeHandler.bind(this));
    MessageBanner.current = document.body.insertBefore(messageBanner, document.body.firstChild);
    return messageBanner;
  }

  private _closeHandler = () => this.dismiss();

  private _expandHandler = ({ currentTarget }: Event) => {
    const messageBannerExpandedClass = `${MESSAGE_BANNER_BASE_CLASS}-expand`;
    const parent = (currentTarget as Element).parentElement;
    if (parent.classList.contains(messageBannerExpandedClass)) {
      parent.classList.remove(messageBannerExpandedClass);
    } else {
      parent.classList.add(messageBannerExpandedClass);
    }
  }
}
