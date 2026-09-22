import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Calendar, Phone, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PersonalDetails } from '../types';
import DateInput from './DateInput';
import { useLanguage } from '../i18n';

interface QuickProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: PersonalDetails | null;
  onSave: (profile: PersonalDetails) => void;
  onLoadDemo: () => void;
}

export const QuickProfileModal: React.FC<QuickProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave,
  onLoadDemo,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name || '');
      setDob(currentProfile.dob || '');
      setGender(currentProfile.gender || 'MALE');
      setMobile(currentProfile.mobile || '');
      setEmail(currentProfile.email || '');
    } else {
      setName('');
      setDob('');
      setGender('MALE');
      setMobile('');
      setEmail('');
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob) return;

    const profile: PersonalDetails = {
      name: name.trim(),
      dob,
      gender,
      mobile: mobile.trim() || '9930117696',
      email: email.trim(),
    };
    onSave(profile);
    onClose();
  };

  const handleDemo = () => {
    onLoadDemo();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-[#E5E7EB] text-[#1F2937] relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D97706]/10 border border-[#D97706]/20 flex items-center justify-center text-[#D97706]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-playfair text-[#1F2937]">
                {t('profile.editProfileTitle')}
              </h3>
              <p className="text-xs text-[#6B7280]">
                {t('profile.editProfileDesc')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t('common.fullName')} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#D97706] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="उदा. राजीव सिंह चौहान"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F4EF] border border-[#E5E7EB] rounded-xl text-sm font-medium focus:border-[#D97706] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t('common.dateOfBirth')} *
              </label>
              <DateInput
                id="quick-modal-dob"
                value={dob}
                onChange={setDob}
                required
                className="py-3 bg-[#F8F4EF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {t('common.gender')}
                </label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8F4EF] border border-[#E5E7EB] rounded-xl text-sm font-medium focus:border-[#D97706] outline-none transition cursor-pointer"
                >
                  <option value="MALE">{t('common.male')}</option>
                  <option value="FEMALE">{t('common.female')}</option>
                  <option value="OTHER">{t('common.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  {t('common.mobileNumber')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#D97706] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="9930117696"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F4EF] border border-[#E5E7EB] rounded-xl text-sm font-mono focus:border-[#D97706] outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:from-[#B45309] hover:to-[#D97706] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> {t('common.save')}
              </button>
              <button
                type="button"
                onClick={handleDemo}
                className="bg-[#F2E8DC] text-[#D97706] py-3 px-4 rounded-xl text-xs font-bold hover:bg-[#E5D7C6] transition border border-[#D97706]/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t('common.loadDemo')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
