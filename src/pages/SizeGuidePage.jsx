import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

const sizes = [
  { size: 'XS', bust: '32', waist: '26', hip: '36', recommended: 'Petite frames or close-fitting silhouettes' },
  { size: 'S', bust: '34', waist: '28', hip: '38', recommended: 'A neat everyday fit with light ease' },
  { size: 'M', bust: '36', waist: '30', hip: '40', recommended: 'Comfortable regular fit for most styles' },
  { size: 'L', bust: '38', waist: '32', hip: '42', recommended: 'Relaxed fit or structured garments with ease' },
  { size: 'XL', bust: '40', waist: '34', hip: '44', recommended: 'Roomier fit for movement and layering' },
];

const instructions = [
  {
    title: 'Bust',
    copy: 'Measure around the fullest part of your bust while keeping the tape level across your back.',
  },
  {
    title: 'Waist',
    copy: 'Measure around the narrowest part of your natural waist without pulling the tape too tight.',
  },
  {
    title: 'Hip',
    copy: 'Measure around the fullest part of your hips with your feet together and the tape parallel to the floor.',
  },
];

function SizeGuidePage() {
  return (
    <>
      <Seo
        title="Size Guide | Amorah N-ZAN Designs"
        description="Use the Amorah size guide for bust, waist and hip measurements with recommended sizes from XS to XL."
        path="/size-guide"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Size Guide', path: '/size-guide' },
        ]}
      />

      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container>
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Fit guide</p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              Find Your Amorah Size
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-amorah-brown">
              Use this guide as a starting point for dresses, tops, kurtis, co-ord sets and ethnic wear. Product pages
              may include additional fit notes for specific silhouettes.
            </p>
          </section>

          <section className="mt-8 overflow-hidden border border-amorah-border bg-amorah-white">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-left text-sm">
                <caption className="sr-only">Amorah recommended size chart in inches</caption>
                <thead className="bg-amorah-black text-amorah-white">
                  <tr>
                    <th scope="col" className="px-4 py-4 font-semibold">Size</th>
                    <th scope="col" className="px-4 py-4 font-semibold">Bust</th>
                    <th scope="col" className="px-4 py-4 font-semibold">Waist</th>
                    <th scope="col" className="px-4 py-4 font-semibold">Hip</th>
                    <th scope="col" className="px-4 py-4 font-semibold">Recommended for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amorah-border">
                  {sizes.map((item) => (
                    <tr key={item.size}>
                      <th scope="row" className="px-4 py-4 font-semibold text-amorah-black">{item.size}</th>
                      <td className="px-4 py-4 text-amorah-brown">{item.bust} in</td>
                      <td className="px-4 py-4 text-amorah-brown">{item.waist} in</td>
                      <td className="px-4 py-4 text-amorah-brown">{item.hip} in</td>
                      <td className="px-4 py-4 text-amorah-brown">{item.recommended}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            {instructions.map((instruction) => (
              <article key={instruction.title} className="border border-amorah-border bg-amorah-white p-5">
                <h2 className="font-heading text-2xl font-semibold text-amorah-black">{instruction.title}</h2>
                <p className="mt-3 text-sm leading-7 text-amorah-brown">{instruction.copy}</p>
              </article>
            ))}
          </section>

          <section className="mt-10 border border-amorah-border bg-amorah-white p-5 sm:p-6">
            <h2 className="font-heading text-2xl font-semibold text-amorah-black">Fit notes</h2>
            <p className="mt-3 text-sm leading-7 text-amorah-brown">
              If you are between sizes, choose the larger size for fitted dresses, kurtis and tailored co-ord sets.
              Choose based on your bust for tops and based on your hip for bottoms or straight silhouettes.
            </p>
          </section>
        </Container>
      </main>
    </>
  );
}

export default SizeGuidePage;
