import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-120px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 mb-12"
        >
          <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <h1 className="relative text-4xl md:text-5xl font-bold tracking-tight text-center">
            Deutsche Hochschule für Medizin College (DHMC)
          </h1>
          <p className="relative mt-4 text-center text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Leading private medical institution in Ethiopia. Established in Bahir Dar, DHMC advances healthcare through excellent education, impactful research, and community service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <FadeInSection className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h2 className="text-2xl font-bold mb-3">Welcome to DHMC</h2>
            <p className="leading-8">
              Deutsche Hochschule für Medizin College (DHMC) is a premier private medical college dedicated to preparing competent healthcare professionals with cutting-edge knowledge and practical skills to meet regional and global healthcare needs.
            </p>
          </FadeInSection>
          <FadeInSection delay={0.05} className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h2 className="text-2xl font-bold mb-3">About the College</h2>
            <p className="leading-8">
              Recognized as a leading private medical college in Ethiopia, DHMC delivers high-quality education, innovative research, and active community engagement to foster improvements in public health.
            </p>
          </FadeInSection>
        </div>

        <FadeInSection className="rounded-xl border border-border bg-card/50 backdrop-blur p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
          <h2 className="text-2xl font-bold mb-4">Vision</h2>
          <p className="leading-8">
                To be a renowned institution recognized for innovative education, impactful research, and leadership in healthcare development regionally and globally.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Mission</h2>
              <p className="leading-8">
                To deliver high-quality, competency-based education and research that prepares healthcare professionals committed to ethical standards, community service, and lifelong learning.
              </p>
            </div>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FadeInSection className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h3 className="text-xl font-semibold mb-2">Academic Excellence</h3>
            <ul className="list-disc ml-5 space-y-2 leading-8">
              <li><span className="font-medium">Comprehensive Programs</span>: Undergraduate and postgraduate studies in Medicine, Nursing, and Medical Radiology.</li>
              <li><span className="font-medium">Integrated Curriculum</span>: Theoretical learning blended with hands-on training and clinical exposure.</li>
            </ul>
          </FadeInSection>
          <FadeInSection delay={0.05} className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h3 className="text-xl font-semibold mb-2">State-of-the-Art Facilities</h3>
            <ul className="list-disc ml-5 space-y-2 leading-8">
              <li><span className="font-medium">Healthcare Network</span>: Affiliated hospitals, clinics, and training centers for real clinical exposure.</li>
              <li><span className="font-medium">Digital Learning</span>: Moodle-powered e-learning platform for resources and remote interaction.</li>
          </ul>
          </FadeInSection>
          <FadeInSection delay={0.1} className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h3 className="text-xl font-semibold mb-2">Accreditation & Recognition</h3>
            <p className="leading-8">
              All programs are accredited by the Ethiopian Ministry of Education and align with national and international standards, ensuring academic credibility and global recognition.
            </p>
          </FadeInSection>
          <FadeInSection delay={0.15} className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h3 className="text-xl font-semibold mb-2">Research & Innovation</h3>
            <p className="leading-8">
              With active research institutes, DHMC supports faculty and student projects and collaborates with international partners to advance medical science and healthcare solutions.
            </p>
          </FadeInSection>
          <FadeInSection delay={0.2} className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
            <p className="leading-8">
              A dedicated Quality Assurance Unit ensures continuous improvement through assessments, audits, and stakeholder feedback, upholding academic excellence and institutional integrity.
            </p>
          </FadeInSection>
          <FadeInSection delay={0.25} className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h3 className="text-xl font-semibold mb-2">International Partnerships</h3>
            <p className="leading-8">
              Active collaborations with universities and research institutions worldwide enable academic exchange and joint research initiatives.
            </p>
          </FadeInSection>
        </div>

        <FadeInSection className="rounded-xl border border-border bg-card/50 backdrop-blur p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">Student Support & Community Engagement</h2>
          <p className="leading-8">
            We provide academic advising, counselling, extracurricular activities, and community outreach opportunities that enrich student life and foster professional growth.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <FadeInSection className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h2 className="text-2xl font-bold mb-3">Academic Schools & Programs</h2>
            <ul className="list-disc ml-5 space-y-2 leading-8">
              <li><span className="font-medium">School of Medicine</span>: Emphasizes clinical skills, medical knowledge, and patient-centred care.</li>
              <li><span className="font-medium">School of Health Sciences</span>: Offers Nursing and Medical Radiology Sciences.</li>
          </ul>
          </FadeInSection>
          <FadeInSection delay={0.05} className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h2 className="text-2xl font-bold mb-3">Healthcare Services & Practical Training</h2>
            <p className="leading-8">
              An extensive network of healthcare facilities serves as training grounds and community service hubs. This integration provides real-world clinical experience and enhances readiness for practice.
            </p>
          </FadeInSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <FadeInSection className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h2 className="text-2xl font-bold mb-3">Admissions</h2>
            <p className="leading-8">
              Our admission process is transparent, structured, and student-centric. We guide prospective students through requirements, procedures, and deadlines, valuing diversity and commitment to healthcare excellence.
            </p>
          </FadeInSection>
          <FadeInSection delay={0.05} className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
            <h2 className="text-2xl font-bold mb-3">Research & Community Development</h2>
            <p className="leading-8">
              DHMC fosters a vibrant research culture across disciplines and partners with community organizations to promote health awareness and service delivery.
            </p>
          </FadeInSection>
        </div>

        <FadeInSection className="rounded-xl border border-border bg-card/50 backdrop-blur p-6">
          <h2 className="text-2xl font-bold mb-3">Our Students & Alumni</h2>
          <ul className="list-disc ml-5 space-y-2 leading-8">
            <li><span className="font-medium">Student-Focused Environment</span>: A supportive atmosphere that nurtures academic excellence and personal development.</li>
            <li><span className="font-medium">Alumni Network</span>: Graduates contribute to healthcare locally and internationally with ongoing mentorship, networking, and professional development.</li>
          </ul>
        </FadeInSection>
      </div>
    </div>
  );
}


