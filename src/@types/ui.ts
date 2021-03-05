/* ------------------------------------
=> Store UI related types
------------------------------------ */
export interface HeaderLang {
  myBookings: string;
  services: string;
  aboutUs: string;
  contact: string;
  selectLang: string;
  comingLang: string;
  english: string;
  bahasa: string;
  registerLogin: string;
  bottomHome: string;
  bottomMenu: string;
  bottomSetting: string;
  bottomAccount: string;
  bottomMessages: string;
  bottomHint: string;
  bottomTheme: string;
}

export interface TripBoxLang {
  arrivalLabel: string;
  arrivalPlaceholder: string;
  arrivalHint: string;
  arrivalDateLabel: string;
  arrivalDatePlaceholder: string;
  arrivalDateHint: string;
  arrivalTimeLabel: string;
  arrivalTimePlaceholder: string;
  arrivalTimeHint: string;
  departureLabel: string;
  departurePlaceholder: string;
  departureHint: string;
  departureDateLabel: string;
  departureDatePlaceholder: string;
  departureDateHint: string;
  departureTimeLabel: string;
  departureTimePlaceholder: string;
  departureTimeHint: string;
  couponButtonActive: string;
  couponButtonInactive: string;
  couponLabel: string;
  couponPlaceholder: string;
  couponHint: string;
  bookButton: string;
}

export interface HomeContentLang {
  announcements: string;
  promoAndDeals: string;
}

export interface FooterLang {
  firstLineDisclaimer: string;
  secondLineDisclaimer: string;
}

export interface CurrentLanguageSetting {
  header: HeaderLang;
  tripBox: TripBoxLang;
  homeContent: HomeContentLang;
  footer: FooterLang;
}

export interface UiState {
  languageSetting: CurrentLanguageSetting;
}

/* ------------------------------------
=> Index page related types
------------------------------------ */
export interface SidebarMenuItem {
  icon: string;
  title: string;
  to: string;
}
