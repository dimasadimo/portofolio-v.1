import React from 'react';
import { motion } from 'motion/react';
import { useIntl } from 'react-intl';
import { Linkedin, Dribbble, Instagram, Github, ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const intl = useIntl();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 px-4 md:px-12 overflow-hidden bg-[var(--bg-primary)]">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Photo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative aspect-square w-full max-w-[500px] mx-auto rounded-2xl overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/dimas/800/800"
              alt="Dimas Adimo"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange/40 via-transparent to-transparent opacity-60 mix-blend-overlay" />
            <div className="absolute inset-0 ring-1 ring-white/20 inset-shadow-xs" />
          </div>
          {/* Decorative blur element behind image */}
          <div className="absolute -z-10 -top-8 -left-8 w-32 h-32 bg-orange opacity-40 blur-3xl" />
        </motion.div>

        {/* Right Side: Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="order-1 lg:order-2 space-y-8"
        >
          <div className="space-y-4">
            <motion.p variants={itemVariants} className="text-[var(--text-muted)] font-display text-lg tracking-widest uppercase">
              {intl.formatMessage({ id: 'hero.domain' })}
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-x-6 gap-y-2 text-[var(--text-muted)] font-light italic">
              {(intl.messages['hero.roles'] as unknown as string[] || []).map((role, idx) => (
                <span key={idx} className="hover:text-orange transition-colors cursor-default whitespace-nowrap">
                  {role}
                </span>
              ))}
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-7xl md:text-8xl lg:text-9xl font-thin tracking-tighter leading-none"
            >
              {intl.formatMessage({ id: 'hero.name' })}
            </motion.h1>
          </div>

          <div className="space-y-6 pt-12 border-t border-[var(--border-color)]">
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-xl font-medium">{intl.formatMessage({ id: 'hero.location' })}</p>
                <p className="text-[var(--text-muted)] text-sm">{intl.formatMessage({ id: 'hero.availability' })}</p>
              </div>

              <div className="flex gap-6">
                {[
                  { icon: Linkedin, href: "#" },
                  { icon: Dribbble, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Github, href: "#" },
                  { icon: ArrowUpRight, href: "#" },
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    whileHover={{ y: -4, color: "#FE5402" }}
                    className="text-[var(--text-muted)] transition-colors"
                  >
                    <social.icon size={22} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-orange to-transparent" />
      </motion.div>
    </section>
  );
};
