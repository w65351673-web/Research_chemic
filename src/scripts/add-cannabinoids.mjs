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
    name: '5-CL-ADBA (5-Chloro-ADBA)',
    slug: '5-cl-adba',
    category: 'cannabinoids',
    images: [],
    description: `5-CL-ADBA, formally known as 5-Chloro-ADBA or (S)-N-(adamantan-1-yl)-1-(5-chloropentyl)-1H-indazole-3-carboxamide, is a synthetic cannabinoid of the indazole-3-carboxamide class. It is one of the most widely characterised third-generation synthetic cannabinoids and has become a standard reference compound in cannabinoid receptor pharmacology.

Synthetic cannabinoids of this class act as highly potent full agonists at both cannabinoid receptor type 1 (CB1) and cannabinoid receptor type 2 (CB2). Unlike Δ9-tetrahydrocannabinol (THC), which is a partial agonist at CB1 with a maximum efficacy well below that of endogenous cannabinoids, compounds such as 5-CL-ADBA are full agonists capable of producing maximal receptor activation. This difference in intrinsic efficacy is pharmacologically significant and underlies the distinct pharmacological profile compared to natural cannabis.

The indazole ring system replaces the indole scaffold used in earlier synthetic cannabinoids such as JWH-018, and the adamantyl group at the carboxamide nitrogen represents a bulky, lipophilic moiety that contributes to high CB1 receptor binding affinity. The 5-chloropentyl chain at N1 of the indazole ring is the same alkyl halide substitution found in other potent synthetic cannabinoids of this generation, and its length and terminal chloro group have been identified in SAR studies as critical determinants of receptor binding affinity and selectivity.

5-CL-ADBA has been thoroughly characterised by HPLC-MS/MS, NMR, and X-ray crystallography in some studies, and its analytical fingerprint — including characteristic mass spectrometric fragmentation ions — is well documented in forensic chemistry databases. It is widely used as a reference standard in forensic toxicology, analytical method development, and cannabinoid receptor pharmacology.

Our 5-CL-ADBA is manufactured to 99%+ purity, confirmed by HPLC-MS, ¹H and ¹³C NMR spectroscopy, and elemental analysis. A full Certificate of Analysis with complete spectral data is provided with every order.`,
    priceVariants: [
      { quantity: 25, price: 340 },
      { quantity: 50, price: 470 },
      { quantity: 100, price: 630 },
      { quantity: 500, price: 1080 },
      { quantity: 1000, price: 1850 },
    ],
    countInStock: 45,
    rating: 4.8,
    numReviews: 34,
    featured: true,
  },
  {
    name: '5-FADB (5-Fluoro-ADB)',
    slug: '5-fadb',
    category: 'cannabinoids',
    images: [],
    description: `5-FADB, also known as 5-Fluoro-ADB or MDMB-5F-PINACA, is a synthetic cannabinoid of the indazole-3-carboxamide class featuring a tert-leucine methyl ester (ADB) group at the carboxamide nitrogen and a 5-fluoropentyl chain at the N1 position of the indazole ring. It is one of the most potent and pharmacologically active synthetic cannabinoids within its structural class and has been extensively studied in forensic, analytical, and receptor pharmacology contexts.

The fluorine atom at the terminal position of the pentyl chain plays a significant role in determining the compound's pharmacokinetic and pharmacodynamic properties. The C–F bond is highly stable and resistant to metabolic oxidation, which influences the compound's metabolic half-life and the nature of its metabolic breakdown products compared to non-fluorinated analogues. This makes 5-FADB particularly valuable in metabolic stability studies and in vitro metabolism research.

5-FADB acts as a highly potent full agonist at CB1 and CB2 cannabinoid receptors. Its tert-leucine methyl ester (ADB) pharmacophore contributes to exceptional binding affinity at the orthosteric binding site of the CB1 receptor, with in vitro potency substantially exceeding that of THC. In functional assays measuring cAMP inhibition or β-arrestin recruitment, 5-FADB demonstrates full agonism with sub-nanomolar EC50 values at CB1.

The compound's metabolic pathway has been characterised using human liver microsomes and recombinant CYP enzymes, identifying primary metabolic routes including ester hydrolysis, hydroxylation of the fluoropentyl chain, and N-dealkylation. These metabolites have been characterised and documented as forensic reference materials.

Our 5-FADB is produced to 99%+ purity, confirmed by HPLC-MS, multinuclear NMR, and elemental analysis. A complete Certificate of Analysis with spectral data is included with every batch.`,
    priceVariants: [
      { quantity: 25, price: 340 },
      { quantity: 50, price: 470 },
      { quantity: 100, price: 630 },
      { quantity: 500, price: 1080 },
      { quantity: 1000, price: 1850 },
    ],
    countInStock: 40,
    rating: 4.8,
    numReviews: 28,
    featured: true,
  },
  {
    name: '6-CL-ADBA (6-Chloro-ADBA)',
    slug: '6-cl-adba',
    category: 'cannabinoids',
    images: [],
    description: `6-CL-ADBA is a synthetic cannabinoid of the indazole-3-carboxamide class, structurally analogous to 5-CL-ADBA but distinguished by the presence of a 6-chlorohexyl chain at the N1 position of the indazole ring rather than the 5-chloropentyl chain of its isomer. This single additional carbon in the alkyl chain produces measurable differences in lipophilicity, metabolic stability, and cannabinoid receptor binding affinity, making 6-CL-ADBA a critical comparison compound in SAR studies of the indazole synthetic cannabinoid series.

The relationship between N1-alkyl chain length and CB1 receptor binding affinity is one of the most studied SAR parameters in synthetic cannabinoid research. Data from competitive radioligand binding assays and functional cAMP assays have shown that chain length optimisation in this region of the molecule significantly impacts receptor affinity, with the 6-carbon chain producing a distinct pharmacological profile compared to the 5-carbon chain of 5-CL-ADBA. Understanding these differences is fundamental to elucidating the geometry of the CB1 receptor binding site.

Like other members of the indazole-3-carboxamide class, 6-CL-ADBA features the adamantyl carboxamide pharmacophore that confers high lipophilicity and contributes to potent CB1 and CB2 receptor engagement. The compound acts as a full agonist at both receptor subtypes, activating Gi/Go-coupled signalling cascades that suppress adenylyl cyclase activity, reduce cAMP production, activate MAPK pathways, and modulate ion channel function.

6-CL-ADBA has been analytically characterised by HPLC-MS, NMR spectroscopy, and IR analysis. Its mass spectrometric fragmentation pattern and chromatographic properties are documented in forensic chemistry reference databases.

Our 6-CL-ADBA is produced to 99%+ purity, confirmed by HPLC-MS and NMR spectroscopy. A full Certificate of Analysis is provided with every order.`,
    priceVariants: [
      { quantity: 25, price: 340 },
      { quantity: 50, price: 470 },
      { quantity: 100, price: 630 },
      { quantity: 500, price: 1080 },
      { quantity: 1000, price: 1850 },
    ],
    countInStock: 38,
    rating: 4.7,
    numReviews: 19,
    featured: false,
  },
  {
    name: 'JWH-018',
    slug: 'jwh-018',
    category: 'cannabinoids',
    images: [],
    description: `JWH-018, formally known as 1-pentyl-3-(1-naphthoyl)indole or AM-678, is one of the most historically significant synthetic cannabinoids ever synthesised. It was created by Dr. John W. Huffman and colleagues at Clemson University in 1995 as part of a systematic research programme to develop pharmacological tools for investigating the endocannabinoid system. The compound takes its name from Dr. Huffman's initials and was the 18th compound in his research series.

JWH-018 is an aminoalkylindole (AAI) cannabinoid that acts as a full agonist at both CB1 and CB2 receptors. Competitive radioligand binding studies have established its Ki values at approximately 9 nM at CB1 and 2.9 nM at CB2, indicating substantially higher affinity for the CB2 receptor compared to CB1 — a selectivity profile that has made it particularly valuable in CB2 receptor research. For comparison, THC has a Ki of approximately 40 nM at CB1 and 36 nM at CB2.

JWH-018's naphthoylindole scaffold — comprising an indole core with a 1-naphthoyl group at the 3-position and a pentyl chain at N1 — defined the foundational structural template for a generation of synthetic cannabinoid research. Extensive SAR work derived from this scaffold has examined the impact of modifying the indole core, the aromatic acyl group, and the N-alkyl chain, generating an enormous body of data that continues to inform our understanding of CB1 and CB2 receptor binding pharmacophores.

As the first widely documented potent synthetic cannabinoid, JWH-018 has been the subject of hundreds of published scientific studies spanning receptor pharmacology, metabolite identification (using human liver microsomes), behavioural pharmacology in animal models, and analytical detection methods. Its complete metabolic profile — including monohydroxylation and carboxylation of the pentyl chain — is thoroughly documented.

Our JWH-018 is produced to 99%+ purity, confirmed by HPLC-MS, ¹H NMR, ¹³C NMR, and elemental analysis. A full Certificate of Analysis with spectral data is provided with every batch.`,
    priceVariants: [
      { quantity: 25, price: 300 },
      { quantity: 50, price: 420 },
      { quantity: 100, price: 560 },
      { quantity: 500, price: 960 },
      { quantity: 1000, price: 1650 },
    ],
    countInStock: 50,
    rating: 4.9,
    numReviews: 47,
    featured: true,
  },
  {
    name: 'ADB-BUTINACA',
    slug: 'adb-butinaca',
    category: 'cannabinoids',
    images: [],
    description: `ADB-BUTINACA, also known as ADBICA or N-(1-amino-3,3-dimethyl-1-oxobutan-2-yl)-1-butyl-1H-indazole-3-carboxamide, is a synthetic cannabinoid of the indazole-3-carboxamide class. It belongs to the ADB (tert-leucinamide) pharmacophore series, which has been identified as one of the most consistently high-affinity scaffolds for cannabinoid receptor binding among synthetic cannabinoids.

ADB-BUTINACA features a butyl chain at the N1 position of the indazole ring — as opposed to the pentyl or fluoropentyl chains present in analogues such as 5-FADB or ADB-FUBINACA. This shorter alkyl chain influences the compound's lipophilicity and receptor binding properties in ways that have been documented in comparative SAR studies. Despite the shorter N1-alkyl chain, ADB-BUTINACA retains potent CB1 receptor agonist activity, with the ADB tert-leucinamide group at the 3-position providing the high-affinity binding interaction with the receptor's orthosteric site.

As a full agonist at CB1 receptors, ADB-BUTINACA activates Gi/Go-coupled intracellular signalling pathways, leading to inhibition of adenylyl cyclase, reduction of intracellular cAMP, modulation of MAPK/ERK signalling, and regulation of ion channel activity. These downstream effects collectively modulate neurotransmitter release, neuronal excitability, and synaptic plasticity — processes that are central to cannabinoid receptor research.

ADB-BUTINACA's in vitro metabolism has been characterised using hepatic microsomes, identifying hydroxylation and amide hydrolysis as primary metabolic routes. Its phase I and phase II metabolites have been documented in analytical reference databases, and the compound itself is widely used as a reference standard in forensic toxicology and cannabinoid analytical chemistry.

Our ADB-BUTINACA is produced to 99%+ purity, confirmed by HPLC-MS, NMR spectroscopy (¹H and ¹³C), and elemental analysis. A comprehensive Certificate of Analysis with full spectral documentation is provided with every order.`,
    priceVariants: [
      { quantity: 25, price: 330 },
      { quantity: 50, price: 460 },
      { quantity: 100, price: 610 },
      { quantity: 500, price: 1050 },
      { quantity: 1000, price: 1800 },
    ],
    countInStock: 42,
    rating: 4.8,
    numReviews: 26,
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
