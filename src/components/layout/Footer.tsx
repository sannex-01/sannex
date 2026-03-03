import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentLang = i18n.language || 'en';

  return (
    <footer className="relative z-20 isolate border-t border-zinc-800 bg-zinc-950">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-xl font-bold text-zinc-100">Sannex</h3>
            <p className="text-sm text-zinc-400">{t('footer.description')}</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-zinc-100">{t('footer.servicesHeading')}</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>{t('footer.service1')}</li>
              <li>{t('footer.service2')}</li>
              <li>{t('footer.service3')}</li>
              <li>{t('footer.service4')}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-zinc-100">{t('footer.contactHeading')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                <a href="mailto:info@sannex.ng" className="transition-colors hover:text-zinc-100">
                  info@sannex.ng
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                <span>+2347048706198</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
                <span>{t('footer.location')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-zinc-400">
              (c) {currentYear} {t('footer.copyright')}
            </p>
            <div className="flex gap-6">
              <Link
                to={`/${currentLang}/privacy-policy`}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                to={`/${currentLang}/terms-of-service`}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
