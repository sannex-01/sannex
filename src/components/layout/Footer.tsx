import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentLang = i18n.language || 'en';

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-xl font-bold text-foreground">Sannex</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t('footer.servicesHeading')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t('footer.service1')}</li>
              <li>{t('footer.service2')}</li>
              <li>{t('footer.service3')}</li>
              <li>{t('footer.service4')}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t('footer.contactHeading')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@sannex.ng" className="hover:text-primary transition-colors">
                  info@sannex.ng
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+2347048706198</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t('footer.location')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {t('footer.copyright')}
            </p>
            <div className="flex gap-6">
              <Link to={`/${currentLang}/privacy-policy`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to={`/${currentLang}/terms-of-service`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
