import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const productSchema = new mongoose.Schema({
  name: String, slug: String, category: String,
  images: [String], description: String,
  priceVariants: [{ quantity: Number, price: Number }],
  countInStock: Number, rating: Number, numReviews: Number, featured: Boolean,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const products = [
  {
    name: 'Crystal Methamphetamine',
    slug: 'crystal-methamphetamine',
    category: 'research chemicals',
    images: [],
    description: `Crystal methamphetamine is the crystalline form of methamphetamine hydrochloride, a potent central nervous system stimulant of the phenethylamine and amphetamine class. First synthesised in 1893 by Japanese chemist Nagai Nagayoshi from ephedrine, and later crystallised in a more potent form by Akira Ogata in 1919, methamphetamine has been one of the most studied psychostimulants in neuroscience.

Methamphetamine exerts its effects primarily by massively increasing the release of monoamine neurotransmitters — dopamine, norepinephrine, and serotonin — from nerve terminals, while simultaneously blocking their reuptake transporters. This results in prolonged and greatly amplified neurotransmitter activity in the synapse. The dopaminergic effect is particularly pronounced, with methamphetamine releasing dopamine at concentrations many times higher than those produced by natural rewards, making it one of the most powerful dopaminergic agents known.

At the molecular level, methamphetamine enters neurons via monoamine transporters (DAT, NET, SERT), where it reverses the direction of transporter function, causing non-exocytotic efflux of monoamines into the synapse. It also inhibits monoamine oxidase (MAO) and disrupts vesicular monoamine transporter 2 (VMAT2) function, flooding the cytoplasm with monoamines available for efflux.

The crystal form (ice) is the hydrochloride salt that has been recrystallised to produce large, clear, high-purity crystals. Our product achieves 99%+ purity, verified by gas chromatography-mass spectrometry (GC-MS) and HPLC. A full Certificate of Analysis is provided with every batch. Used extensively in dopaminergic system research, addiction neuroscience, and stimulant pharmacology studies.`,
    priceVariants: [
      { quantity: 25, price: 320 },
      { quantity: 50, price: 450 },
      { quantity: 100, price: 600 },
      { quantity: 500, price: 1050 },
      { quantity: 1000, price: 1800 },
    ],
    countInStock: 40,
    rating: 4.8,
    numReviews: 31,
    featured: true,
  },
  {
    name: '3-CMC (3-Chloromethcathinone)',
    slug: '3-cmc-3-chloromethcathinone',
    category: 'research chemicals',
    images: [],
    description: `3-CMC, or 3-Chloromethcathinone, is a synthetic cathinone and substituted amphetamine derivative belonging to the broader phenethylamine class of compounds. It is the 3-position chloro-substituted analogue of methcathinone and is structurally related to the naturally occurring stimulant cathinone found in the khat plant (Catha edulis).

Synthetic cathinones share a core β-keto amphetamine structure, and like other members of this class, 3-CMC acts primarily as a releaser and reuptake inhibitor of monoamine neurotransmitters. The chloro substituent at the meta (3-) position of the phenyl ring significantly influences the compound's binding affinity at dopamine, norepinephrine, and serotonin transporters (DAT, NET, SERT) compared to the unsubstituted parent compound.

Structure-activity relationship (SAR) research within the synthetic cathinone series has demonstrated that halogen substitution at the 3-position generally produces compounds with altered transporter selectivity profiles. 3-CMC exhibits potent activity at DAT and NET, making it a useful pharmacological tool for investigating catecholaminergic neurotransmission and comparing the effect of ring substitution position (3- versus 4-) on transporter activity.

The compound is of significant interest in neuropharmacology, analytical chemistry, and forensic science. Its physicochemical properties — including aqueous solubility as the hydrochloride salt, LogP, and plasma protein binding — have been characterised and are documented in the scientific literature.

Our 3-CMC is produced to 99%+ purity, confirmed by HPLC-MS, NMR spectroscopy, and elemental analysis. A full Certificate of Analysis is provided with every batch, including complete spectral data for analytical verification.`,
    priceVariants: [
      { quantity: 25, price: 280 },
      { quantity: 50, price: 390 },
      { quantity: 100, price: 520 },
      { quantity: 500, price: 900 },
      { quantity: 1000, price: 1550 },
    ],
    countInStock: 35,
    rating: 4.6,
    numReviews: 14,
    featured: false,
  },
  {
    name: '4-CMC (4-Chloromethcathinone)',
    slug: '4-cmc-4-chloromethcathinone',
    category: 'research chemicals',
    images: [],
    description: `4-CMC, or 4-Chloromethcathinone (also known as Clephedrone), is a synthetic cathinone derivative with a chloro substituent at the para (4-) position of the phenyl ring. It is a structural isomer of 3-CMC and belongs to the same β-keto amphetamine pharmacological class.

The para-chloro substitution in 4-CMC is of considerable SAR interest within the cathinone series. Comparative studies between 3-CMC and 4-CMC consistently demonstrate that the position of the halogen substituent on the phenyl ring produces meaningfully different pharmacological profiles, particularly with respect to monoamine transporter selectivity and relative potency. 4-CMC has been characterised as a substrate-type releaser at DAT and NET, with activity at SERT, placing it in the mixed dopaminergic-serotoninergic cathinone subclass.

Like other synthetic cathinones, 4-CMC enters monoamine transporter proteins and reverses their direction of transport, triggering non-exocytotic efflux of dopamine, norepinephrine, and serotonin from presynaptic neurons. This mechanism results in increased extracellular monoamine concentrations and consequent stimulation of postsynaptic receptors.

4-CMC is widely used as an analytical reference standard for detection and quantification in biological and forensic matrices. Its mass spectrometric fragmentation pattern, NMR fingerprint, and chromatographic retention data have been thoroughly documented in peer-reviewed literature.

Our 4-CMC is manufactured to 99%+ purity, confirmed by HPLC, NMR, and mass spectrometry. A complete Certificate of Analysis with spectral data is provided with every order.`,
    priceVariants: [
      { quantity: 25, price: 280 },
      { quantity: 50, price: 390 },
      { quantity: 100, price: 520 },
      { quantity: 500, price: 900 },
      { quantity: 1000, price: 1550 },
    ],
    countInStock: 35,
    rating: 4.6,
    numReviews: 18,
    featured: false,
  },
  {
    name: '3-MMC (3-Methylmethcathinone)',
    slug: '3-mmc-3-methylmethcathinone',
    category: 'research chemicals',
    images: [],
    description: `3-MMC, or 3-Methylmethcathinone, is a synthetic cathinone and structural isomer of 4-MMC (mephedrone), differing in the position of the methyl substituent on the phenyl ring — at the meta (3-) position rather than the para (4-) position. It belongs to the β-keto amphetamine class and is closely related to the natural stimulant cathinone.

As a monoamine releaser, 3-MMC acts at all three monoamine transporters (DAT, NET, SERT), triggering the release of dopamine, norepinephrine, and serotonin into the synapse while inhibiting their reuptake. The methyl group at the 3-position subtly alters the compound's electronic and steric properties compared to the 4-position isomer, resulting in a distinct transporter selectivity ratio and potency profile — a difference that is well documented in comparative in vitro pharmacology studies.

SAR investigations within the substituted cathinone series have established that 3-MMC tends to show a different balance of dopaminergic versus serotoninergic activity compared to mephedrone, making it a valuable pharmacological tool for deconstructing the relative contributions of different neurotransmitter systems to stimulant effects. These studies use standardised in vitro assays such as superfusion experiments with rat brain synaptosomes to quantify transporter substrate activity.

3-MMC has been characterised analytically using GC-MS, HPLC-MS/MS, NMR, and IR spectroscopy, with its full analytical profile available in scientific literature. It is commonly used as a reference standard in forensic toxicology and as a pharmacological tool in neurotransmitter research.

Our 3-MMC is produced to 99%+ purity, confirmed by HPLC and NMR spectroscopy. A full Certificate of Analysis is included with every batch.`,
    priceVariants: [
      { quantity: 25, price: 260 },
      { quantity: 50, price: 370 },
      { quantity: 100, price: 490 },
      { quantity: 500, price: 850 },
      { quantity: 1000, price: 1480 },
    ],
    countInStock: 40,
    rating: 4.7,
    numReviews: 22,
    featured: true,
  },
  {
    name: '4-MMC (Mephedrone)',
    slug: '4-mmc-mephedrone',
    category: 'research chemicals',
    images: [],
    description: `4-MMC, commonly known as Mephedrone (also referred to as 4-methylmethcathinone or 4-methylephedrone), is one of the most extensively studied synthetic cathinones and a landmark compound in the history of synthetic stimulant research. It was first synthesised in 1929 by Saem de Burnaga Sanchez, rediscovered and documented online around 2003, and became widely studied by pharmacologists following a surge in scientific interest from 2009 onward.

Mephedrone acts as a non-selective monoamine releaser with potent activity at dopamine (DAT), norepinephrine (NET), and serotonin (SERT) transporters. Unlike cocaine, which blocks these transporters, mephedrone acts as a substrate — it is transported into the neuron and triggers active, non-exocytotic monoamine efflux. Its potency at SERT is notably higher than that of amphetamine, giving it a more pronounced serotonergic component and placing it pharmacologically closer to MDMA in its transporter selectivity ratio.

This distinctive DAT:SERT selectivity profile makes mephedrone one of the most important reference compounds in monoamine pharmacology, used extensively in transporter assays to establish selectivity benchmarks and in animal models to study the neurobiological consequences of combined dopaminergic-serotoninergic stimulation.

Mephedrone's pharmacokinetics, including its rapid metabolism via N-demethylation, ring hydroxylation, and reduction of the β-keto group, have been thoroughly characterised in human and animal studies. Its metabolites — including nor-mephedrone and dihydro-mephedrone — are likewise well documented and available as analytical reference standards.

Our 4-MMC is produced to 99%+ purity, confirmed by HPLC-MS, NMR (¹H and ¹³C), and elemental analysis. A complete Certificate of Analysis with full spectral data is provided with every order.`,
    priceVariants: [
      { quantity: 25, price: 260 },
      { quantity: 50, price: 370 },
      { quantity: 100, price: 490 },
      { quantity: 500, price: 850 },
      { quantity: 1000, price: 1480 },
    ],
    countInStock: 38,
    rating: 4.8,
    numReviews: 29,
    featured: true,
  },
  {
    name: 'α-PiHP (Alpha-pyrrolidinoisohexiophenone)',
    slug: 'alpha-pihp',
    category: 'research chemicals',
    images: [],
    description: `α-PiHP, or alpha-pyrrolidinoisohexiophenone, is a synthetic cathinone of the pyrrolidinophenone subclass. It is structurally characterised by a pyrrolidine ring at the alpha position of the alkyl chain and an isobutyl side chain extending from the beta-keto carbonyl, making it a branched-chain analogue of α-PHP and a close structural relative of α-PVP.

Pyrrolidinophenone cathinones such as α-PiHP are potent and selective catecholamine reuptake inhibitors. Unlike substrate-type cathinones (which trigger active monoamine release), compounds in the pyrrolidinophenone class act primarily as reuptake inhibitors at the dopamine transporter (DAT) and norepinephrine transporter (NET), with little or no activity as releasers and minimal SERT involvement. This makes them pharmacologically more similar to cocaine in their mechanism, though structurally distinct.

The isobutyl chain of α-PiHP (as opposed to the linear butyl chain in α-PHP) introduces a branching point that alters the compound's conformational flexibility and its interaction with the DAT binding site. SAR studies within the pyrrolidinophenone series have demonstrated that branching of the alkyl chain at the alpha or beta position produces measurable differences in potency, selectivity, and duration of action — data of significant value for understanding the structural requirements of monoamine transporter binding.

α-PiHP has been characterised analytically using HPLC-MS, NMR, and X-ray crystallography in some studies. Its physicochemical properties, including LogP, aqueous solubility, and stability under various conditions, have been documented in the analytical and forensic chemistry literature.

Our α-PiHP is produced to 99%+ purity, verified by HPLC-MS and NMR spectroscopy. A full Certificate of Analysis with spectroscopic data is provided with every batch.`,
    priceVariants: [
      { quantity: 25, price: 300 },
      { quantity: 50, price: 420 },
      { quantity: 100, price: 560 },
      { quantity: 500, price: 970 },
      { quantity: 1000, price: 1680 },
    ],
    countInStock: 30,
    rating: 4.7,
    numReviews: 16,
    featured: false,
  },
  {
    name: 'Ketamine Crystal',
    slug: 'ketamine-crystal',
    category: 'research chemicals',
    images: [],
    description: `Ketamine is a dissociative anaesthetic of the arylcyclohexylamine class, first synthesised in 1962 by Calvin Lee Stevens at Parke-Davis laboratories and introduced into clinical practice in the 1970s. It remains one of the most scientifically significant and widely researched pharmacological agents of the 20th and 21st centuries, with an unparalleled breadth of documented clinical, neuroscientific, and therapeutic applications.

Ketamine's primary mechanism of action is as a non-competitive, open-channel blocker of the N-methyl-D-aspartate (NMDA) receptor — an ionotropic glutamate receptor that plays a central role in synaptic plasticity, learning, memory, and pain processing. By blocking NMDA receptors in a use-dependent manner, ketamine disrupts excitatory glutamatergic neurotransmission across multiple brain regions, producing its characteristic dissociative, analgesic, and anaesthetic effects at increasing doses.

Beyond its NMDA antagonism, ketamine interacts with a remarkable range of molecular targets that continue to be the subject of active research: sigma receptors (σ1 and σ2), opioid receptors (mu, kappa, delta), muscarinic acetylcholine receptors, monoamine reuptake transporters, and voltage-gated ion channels. This complex, multi-target pharmacological profile underlies the diversity of ketamine's effects and its therapeutic potential in conditions ranging from treatment-resistant depression to chronic pain.

The crystal form of ketamine hydrochloride represents the highest-purity solid-state form of the compound, produced through controlled crystallisation of pharmaceutical-grade ketamine HCl. Our ketamine crystal achieves 99%+ purity, confirmed by HPLC, NMR spectroscopy, and X-ray powder diffraction. Each batch is racemic (equal mixture of R- and S-enantiomers) unless otherwise specified. A full Certificate of Analysis is included with every order.

Ketamine is indispensable in anaesthesiology research, glutamate receptor pharmacology, depression neurobiology, chronic pain research, psychedelic science, and as a reference standard in analytical chemistry.`,
    priceVariants: [
      { quantity: 25, price: 350 },
      { quantity: 50, price: 490 },
      { quantity: 100, price: 650 },
      { quantity: 500, price: 1120 },
      { quantity: 1000, price: 1950 },
    ],
    countInStock: 35,
    rating: 4.9,
    numReviews: 38,
    featured: true,
  },
  {
    name: 'α-PVP (Alpha-pyrrolidinopentiophenone)',
    slug: 'alpha-pvp',
    category: 'research chemicals',
    images: [],
    description: `α-PVP, or alpha-pyrrolidinopentiophenone (also known as O-2387 or flakka in informal contexts), is a synthetic cathinone of the pyrrolidinophenone class. First synthesised in the 1960s and the subject of renewed scientific interest from the 2010s, α-PVP is one of the most pharmacologically characterised compounds in the pyrrolidinophenone series and serves as a key reference compound for the class.

α-PVP acts as a highly potent and selective catecholamine reuptake inhibitor, blocking the dopamine transporter (DAT) and norepinephrine transporter (NET) with high affinity while showing minimal activity at the serotonin transporter (SERT). This selectivity profile — high DAT/NET potency with low SERT activity — sharply distinguishes it from substrate-type cathinones like mephedrone or MDMA, and makes it a valuable pharmacological tool for studying the specific contributions of dopaminergic and noradrenergic neurotransmission in isolation from serotonergic effects.

The compound's high DAT affinity produces pronounced dopaminergic effects. In vitro DAT inhibition studies using radiolabelled substrate assays have quantified α-PVP's Ki at the dopamine transporter in the nanomolar range, with potency comparable to or exceeding that of cocaine in some assay systems. Its longer duration of action compared to cocaine — attributable to slower DAT dissociation kinetics — makes it a useful comparator in studies of transporter binding kinetics.

Structurally, α-PVP features a pentyl chain at the alpha carbon and a pyrrolidine ring at the nitrogen, with the β-keto group characteristic of all cathinones. Its physicochemical properties, in vitro metabolism via CYP450 enzymes, and in vivo pharmacokinetics have been characterised and published in peer-reviewed journals.

Our α-PVP is produced to 99%+ purity, confirmed by HPLC-MS, NMR spectroscopy, and elemental analysis. A complete Certificate of Analysis with full spectral data is provided with every batch.`,
    priceVariants: [
      { quantity: 25, price: 290 },
      { quantity: 50, price: 400 },
      { quantity: 100, price: 540 },
      { quantity: 500, price: 930 },
      { quantity: 1000, price: 1600 },
    ],
    countInStock: 32,
    rating: 4.7,
    numReviews: 24,
    featured: true,
  },
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  let added = 0, skipped = 0;
  for (const p of products) {
    const exists = await Product.findOne({ slug: p.slug });
    if (exists) { console.log(`SKIP (exists): ${p.name}`); skipped++; continue; }
    await Product.create(p);
    console.log(`ADDED: ${p.name}`);
    added++;
  }

  console.log(`\nDone — ${added} added, ${skipped} skipped.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
