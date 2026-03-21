import HeroSection from './components/heroSection'
import Tools from './components/tools'
export default function Page() {
  return (
    <>
      <HeroSection />
      <section id="ai-content">
        <Tools />
      </section>
    </>
  )
}