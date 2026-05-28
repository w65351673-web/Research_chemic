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

const descriptions = {

  // ── OPIOIDS ──────────────────────────────────────────────────────────────

  'morphine-sulfate': `Morphine Sulfate is a naturally occurring opiate alkaloid derived from the opium poppy (Papaver somniferum) and represents the principal active constituent of opium. First isolated in 1804 by Friedrich Sertürner, it has over two centuries of documented scientific study and remains the benchmark reference compound in opioid receptor pharmacology.

Morphine acts as a full agonist at mu-opioid receptors (MOR) and to a lesser extent at kappa and delta opioid receptors. It engages Gi/Go-coupled signalling pathways, inhibiting adenylyl cyclase activity and modulating ion channel conductance. Its receptor binding profile is the standard against which all other opioid compounds are evaluated in pharmacological research. The sulfate salt form provides superior aqueous solubility and chemical stability compared to the free base, making it ideal for in vitro and in vivo research formulations.

Our Morphine Sulfate is produced to a minimum purity of 99%+, confirmed by HPLC and NMR spectroscopy. It is widely used as a certified reference standard in analytical chemistry, receptor binding assays, pharmacokinetic modelling, and pain research. A full Certificate of Analysis (CoA) with spectral data is included with every order.`,

  'heroin-diacetylmorphine': `Diacetylmorphine, commonly referred to as heroin, is the 3,6-diacetyl ester derivative of morphine. It was first synthesised in 1874 by C.R. Alder Wright at St. Bartholomew's Hospital in London and later commercially developed by Bayer AG in Germany in 1898. It is one of the most extensively studied opioid compounds in addiction neuroscience and pharmacokinetic research.

Diacetylmorphine is a prodrug that undergoes rapid deacetylation in vivo, first to 6-monoacetylmorphine (6-MAM) and subsequently to morphine — both active opioid receptor agonists. The acetylation of morphine significantly increases the compound's lipophilicity, which accelerates its passage across lipid barriers and alters its pharmacokinetic profile compared to morphine. These metabolic conversion pathways make it a key study compound in prodrug pharmacology, opioid metabolism research, and addiction biology.

Our diacetylmorphine is manufactured to 99%+ purity, verified by HPLC-MS and NMR analysis. It is used as an analytical reference standard in forensic toxicology, metabolism studies, and opioid receptor pharmacology research. Each batch is supplied with a comprehensive Certificate of Analysis.`,

  'codeine-phosphate': `Codeine Phosphate is a naturally occurring opiate alkaloid found in the opium poppy (Papaver somniferum) at concentrations of 0.3–3% in raw opium. Structurally it is the 3-methyl ether of morphine, belonging to the phenanthrene class of opioids. It was first isolated in 1832 by Pierre Robiquet and has since become one of the most studied opioid analgesics in pharmacological literature.

Codeine is a well-characterised prodrug primarily metabolised via O-demethylation by the hepatic enzyme CYP2D6 to morphine, which is responsible for the majority of its analgesic activity. This metabolic pathway is central to pharmacogenomic research — individuals with different CYP2D6 genotypes (poor, extensive, and ultrarapid metabolisers) exhibit markedly different pharmacological responses. This makes codeine phosphate an indispensable tool in CYP2D6 enzyme studies, pharmacogenomics research, and pain physiology investigations.

Our Codeine Phosphate is produced to 99%+ purity, confirmed by HPLC and NMR spectroscopy. It is supplied as the phosphate salt for enhanced aqueous solubility. Applications include analytical method validation, opioid receptor studies, and pharmacokinetic modelling. A full Certificate of Analysis is provided with each batch.`,

  'oxycodone-hcl': `Oxycodone Hydrochloride is a semi-synthetic opioid analgesic first synthesised in Germany in 1916 by Martin Freund and Edmund Speyer at the University of Frankfurt. It is derived from thebaine, an alkaloid of the opium poppy, and belongs to the phenanthrene class of opioid compounds.

Oxycodone functions as a full agonist at mu-opioid receptors (MOR) with additional activity at kappa and delta receptors. Its oral bioavailability of 60–87% and predictable pharmacokinetic profile distinguish it from other opioids and have made it a widely used comparator compound in opioid pharmacology studies. Oxycodone's receptor binding kinetics, metabolic pathway via CYP3A4 and CYP2D6, and its active metabolites — including oxymorphone — are thoroughly documented in peer-reviewed literature.

Our Oxycodone HCl is produced to 99%+ purity, verified by HPLC-UV and NMR spectroscopy. The hydrochloride salt provides excellent aqueous solubility suitable for in vitro research formulations. Applications include opioid receptor pharmacology, analytical reference standards, pharmacokinetic studies, and abuse-deterrent formulation research. A complete Certificate of Analysis is included with every order.`,

  'hydrocodone-bitartrate': `Hydrocodone Bitartrate is a semi-synthetic opioid derived from codeine, first synthesised in Germany in 1920 by Carl Mannich and Helene Löwenheim. It is structurally related to both codeine and morphine and has been the subject of extensive pharmacological study, particularly in the fields of analgesia research and CYP enzyme pharmacology.

Hydrocodone acts as a mu-opioid receptor agonist and is partially metabolised to hydromorphone via CYP2D6-mediated O-demethylation. It also exerts antitussive activity through action on the brainstem cough centre. The CYP2D6-dependent metabolic step makes hydrocodone a valuable research tool in pharmacogenomic studies examining genotype-dependent variability in opioid metabolism. The bitartrate salt form offers high aqueous solubility and chemical stability (molecular formula C₁₈H₂₃NO₃·C₄H₆O₆).

Our Hydrocodone Bitartrate is manufactured to 99%+ purity, confirmed by HPLC and NMR spectroscopy. It serves as a certified reference standard in analytical chemistry laboratories, is used in CYP450 enzyme assays, and is a key compound in comparative opioid receptor binding research. A full Certificate of Analysis is supplied with every batch.`,

  'fentanyl-citrate': `Fentanyl Citrate is a synthetic opioid of the 4-anilidopiperidine class, first synthesised in 1960 by Belgian chemist Paul Janssen at Janssen Pharmaceutica. It is among the most extensively studied synthetic opioids in the scientific literature, with applications spanning anaesthesiology research, receptor pharmacology, and opioid analgesic development.

Fentanyl is a selective mu-opioid receptor (MOR) full agonist. Its high lipophilicity enables rapid distribution across physiological membranes, producing a pharmacokinetic profile characterised by fast onset and a duration determined by redistribution rather than metabolism. These distinct pharmacokinetic properties make it a valuable comparator compound in opioid pharmacokinetic studies. Fentanyl's interaction with both G-protein and beta-arrestin signalling pathways at the MOR has also made it central to biased agonism research in opioid pharmacology.

The citrate salt form (molecular formula C₂₂H₂₈N₂O·C₆H₈O₇) offers greatly improved aqueous solubility. Our Fentanyl Citrate is produced to 99%+ purity, confirmed by HPLC-MS, NMR spectroscopy, and elemental analysis. It is used as a certified reference standard in forensic toxicology, analytical chemistry, receptor binding assays, and anaesthesiology research. A full Certificate of Analysis is provided with every batch.`,

  'methadone-hcl': `Methadone Hydrochloride is a synthetic opioid of the diphenylheptane class, developed in Germany in 1937 by Gustav Ehrhart and Max Bockmühl at IG Farben. It possesses a pharmacological profile that is distinct from classical opioids and has been the subject of considerable scientific study across multiple research disciplines.

Methadone acts simultaneously as a full agonist at mu-opioid receptors (MOR) and delta-opioid receptors (DOR), and as an antagonist at N-methyl-D-aspartate (NMDA) receptors. This dual opioid-glutamatergic mechanism is of significant research interest as it distinguishes methadone from structurally and pharmacologically simpler opioids. Its exceptionally long and variable plasma half-life (24–59 hours), attributable to extensive protein binding and tissue accumulation, makes it a key compound in pharmacokinetic modelling. Methadone is metabolised primarily by CYP3A4 and CYP2D6 — interactions that are extensively studied in drug-drug interaction research.

Our Methadone HCl is available as the racemic mixture and is produced to 99%+ purity, confirmed by HPLC, chiral chromatography, and NMR spectroscopy. It is widely used in opioid receptor pharmacology, NMDA receptor research, and pharmacokinetic studies. A comprehensive Certificate of Analysis is provided with every order.`,

  'tramadol-hcl': `Tramadol Hydrochloride is a centrally acting analgesic compound developed by Grünenthal GmbH in Germany and introduced to the scientific community in the 1970s. It is distinguished from classical opioids by its dual, complementary mechanism of action and has been the subject of extensive pharmacological research.

Tramadol and its primary active metabolite O-desmethyltramadol (M1) — formed via CYP2D6-mediated O-demethylation — engage mu-opioid receptors, with M1 possessing substantially greater receptor affinity than the parent compound. Additionally, tramadol inhibits the synaptic reuptake of both serotonin (SERT) and norepinephrine (NET), contributing to analgesic activity through monoaminergic descending pain modulation pathways. This dual mechanism makes it an important pharmacological tool for studying the interaction between opioidergic and monoaminergic neurotransmission systems.

Our Tramadol HCl is produced to 99%+ purity, confirmed by HPLC, NMR, and mass spectrometry. The hydrochloride salt form provides excellent aqueous solubility (molecular formula C₁₆H₂₅NO₂·HCl). It is used in pain pharmacology research, pharmacogenomics studies, serotonin-norepinephrine reuptake inhibition assays, and as a certified reference standard in analytical chemistry. A full Certificate of Analysis is included with every batch.`,

  // ── NITAZENES ─────────────────────────────────────────────────────────────

  'isotonitazene': `Isotonitazene is a synthetic opioid compound belonging to the 2-benzylbenzimidazole (nitazene) class. The nitazene series was originally developed by researchers at CIBA Pharmaceutical Company in Switzerland during the 1950s and 1960s as part of a systematic investigation into novel non-morphine analgesic scaffolds. Isotonitazene is characterised by an isopropyl substituent at the benzimidazole nitrogen and an N,N-diethylaminoethyl side chain.

Isotonitazene is a full agonist at mu-opioid receptors and has been the subject of extensive analytical characterisation since its appearance in forensic and pharmacological literature. Its receptor binding properties, metabolic profile, and physicochemical characteristics have been documented and are available in scientific reference databases. The compound's pharmacological potency within the nitazene series has been quantified in several peer-reviewed receptor binding studies, making it an important reference point for structure-activity relationship (SAR) research in the 2-benzylbenzimidazole opioid class.

Our Isotonitazene is produced to 99%+ purity, confirmed by HPLC-MS and multinuclear NMR analysis. Each batch includes a full Certificate of Analysis with complete spectroscopic data. It is used in opioid receptor pharmacology, forensic reference standard development, analytical method validation, and comparative SAR studies of the benzimidazole opioid series.`,

  'metonitazene': `Metonitazene is a synthetic opioid of the 2-benzylbenzimidazole (nitazene) class, structurally distinguished by a methoxy substituent at the para position of the benzyl phenyl ring. Like other nitazene compounds, it originates from mid-20th century pharmaceutical research at CIBA Pharmaceutical Company in Switzerland.

Metonitazene functions as a full mu-opioid receptor agonist. Within the nitazene structure-activity relationship (SAR) literature, the para-methoxy substitution at the benzyl phenyl ring has been identified as a key determinant of receptor binding affinity relative to unsubstituted analogues. In vitro metabolic studies using human liver microsomes have characterised its primary metabolic routes, including N-dealkylation and O-demethylation, providing data of value in pharmacokinetic and forensic research.

Our Metonitazene is produced to 99%+ purity, confirmed by HPLC-MS, ¹H NMR, ¹³C NMR, and elemental analysis. Full spectroscopic documentation and a Certificate of Analysis are provided with every batch. Primary applications include opioid receptor pharmacology, benzimidazole SAR research, forensic reference material development, and analytical method validation.`,

  'protonitazene': `Protonitazene is a member of the 2-benzylbenzimidazole class of synthetic opioid compounds, characterised by a propyl substituent at the benzimidazole nitrogen atom. It belongs to the same series of nitazene compounds synthesised by CIBA researchers in Switzerland during the 1950s and forms part of a well-documented family of synthetic opioid reference compounds.

As a full mu-opioid receptor agonist, protonitazene provides a critical data point in structure-activity relationship (SAR) studies examining the effect of N-alkyl chain length on receptor binding affinity and selectivity within the nitazene series. The propyl chain distinguishes it from related analogues such as isotonitazene and butonitazene, enabling systematic comparison across the series. Its analytical fingerprint — including NMR chemical shifts, mass spectrometric fragmentation ions, and chromatographic retention data — is documented in forensic chemistry reference databases.

Our Protonitazene is produced to 99%+ purity, confirmed by HPLC-MS and NMR spectroscopy. Comprehensive testing for related impurities and residual solvents is performed on every batch. A full Certificate of Analysis is supplied with each order. It is used in nitazene SAR research, mu-opioid receptor binding assays, and forensic reference standard libraries.`,

  'butonitazene': `Butonitazene is a synthetic opioid compound of the 2-benzylbenzimidazole (nitazene) class, characterised by a butyl substituent on the benzimidazole nitrogen atom. It is part of the nitazene series originally synthesised at CIBA Pharmaceutical Company in Switzerland during the 1950s, which sought to explore the structural determinants of opioid receptor activity within the benzimidazole scaffold.

As a full mu-opioid receptor agonist, butonitazene occupies a defined position in the SAR landscape of the nitazene series, enabling direct comparison of N-alkyl chain length effects on receptor affinity and pharmacokinetic properties relative to shorter-chain analogues (e.g. protonitazene) and longer-chain variants. This comparative SAR data is of fundamental value in understanding the molecular geometry of the opioid receptor binding site and in rationalising the development of novel opioid analgesic scaffolds.

Our Butonitazene is produced to 99%+ purity, confirmed by reverse-phase HPLC-MS, multinuclear NMR spectroscopy, and elemental analysis. A full Certificate of Analysis is included with every batch. It is used in opioid SAR research, mu-opioid receptor binding assays, forensic reference standard libraries, and analytical method validation for the 2-benzylbenzimidazole compound class.`,

  'etonitazene': `Etonitazene is one of the most historically significant compounds in synthetic opioid research. First synthesised in 1957 by researchers at CIBA Pharmaceutical Company in Basel, Switzerland, it was among the earliest 2-benzylbenzimidazole opioids to be pharmacologically characterised and has served as the foundational reference compound for the entire nitazene class for over six decades.

Etonitazene is a full, high-efficacy mu-opioid receptor agonist and is documented as one of the most potent compounds in the nitazene series by receptor binding affinity. Its structural features — an ethoxy group at the para position of the phenyl ring and an N,N-diethylaminoethyl side chain — have been consistently identified in SAR studies as critical contributors to high receptor binding affinity within the benzimidazole scaffold. Its pharmacological profile has been documented across decades of published research, making it the most thoroughly characterised benchmark compound in the nitazene class.

Our Etonitazene is produced to 99%+ purity, confirmed by HPLC-MS, ¹H and ¹³C NMR, infrared spectroscopy, and elemental analysis. It is an essential reference compound in opioid receptor pharmacology, radioligand competitive binding studies, structure-activity relationship research, and forensic reference standard development. A comprehensive Certificate of Analysis is included with every order.`,

  'etodesnitazene': `Etodesnitazene, also known as etazene, is a synthetic opioid of the 2-benzylbenzimidazole class. It is structurally related to etonitazene but lacks the nitro substituent at the 5-position of the benzimidazole ring — a defined structural modification that provides an important data point in the SAR analysis of the nitazene series.

The structural difference between etodesnitazene and etonitazene (absence of the 5-nitro group) makes etodesnitazene a valuable comparison compound for investigating the contribution of the nitro substituent to receptor binding affinity within the benzimidazole opioid scaffold. In vitro data indicates that etodesnitazene retains significant mu-opioid receptor agonist activity, demonstrating that high potency in this compound class is not exclusively dependent on the nitro group. Its metabolic pathway — involving N-deethylation and aromatic hydroxylation — has been characterised using hepatic microsome preparations and is documented in pharmacokinetic research literature.

Our Etodesnitazene is produced to 99%+ purity, confirmed by HPLC-MS, NMR spectroscopy, and elemental analysis. A full Certificate of Analysis with complete spectral data is supplied with every batch. Applications include nitazene SAR research, forensic reference material libraries, mu-opioid receptor pharmacology, and comparative metabolism studies.`,

  'n-pyrrolidino-etonitazene': `N-Pyrrolidino Etonitazene is a structural analogue of etonitazene in which the N,N-diethylaminoethyl side chain is replaced by a pyrrolidine-containing moiety. This modification constitutes a significant structural variation within the etonitazene series and is of particular scientific interest in SAR research examining the role of the amine side chain on opioid receptor binding affinity and functional selectivity.

The incorporation of a pyrrolidine ring — a five-membered saturated nitrogen-containing heterocycle — introduces conformational constraints on the amine substituent that influence molecular interaction with the opioid receptor binding pocket. Comparative binding data from in vitro receptor studies provides insight into the steric and electronic requirements of the benzimidazole binding pharmacophore. N-Pyrrolidino etonitazene retains the core 2-benzylbenzimidazole scaffold and ethoxy substituent characteristic of the etonitazene series, allowing isolated assessment of the N-side chain's contribution to receptor engagement.

Our N-Pyrrolidino Etonitazene is produced to 99%+ purity, confirmed by HPLC-MS, ¹H and ¹³C NMR, and elemental analysis. Full spectroscopic data and a Certificate of Analysis are provided with every order. Applications include advanced benzimidazole opioid SAR research, mu-opioid receptor pharmacology, forensic reference standard development, and studies examining cyclic versus linear amine side chain effects on opioid receptor binding.`,

  'bromazolam': `Bromazolam is a synthetic compound belonging to the triazolobenzodiazepine class — a structural group characterised by the fusion of a benzene ring, a seven-membered diazepine ring, and a 1,2,4-triazole ring. It is closely related to established benzodiazepine research compounds and shares their fundamental mechanism of action at GABA-A receptors.

Bromazolam acts as a positive allosteric modulator of the gamma-aminobutyric acid type A (GABA-A) receptor complex. It binds to the benzodiazepine recognition site located at the interface of alpha and gamma subunits, enhancing the inhibitory effects of GABA — the primary inhibitory neurotransmitter in the central nervous system — by increasing chloride ion conductance and thereby reducing neuronal excitability. The inclusion of the triazole ring in the triazolobenzodiazepine scaffold generally confers improved receptor binding affinity and metabolic resistance compared to classical benzodiazepines. The bromo substituent at the 8-position of the diazepine ring contributes to its distinct physicochemical profile. Primary metabolic routes include hydroxylation and glucuronidation, which have been characterised in analytical studies.

Our Bromazolam is produced to 99%+ purity, confirmed by HPLC, NMR spectroscopy, and mass spectrometry. A comprehensive Certificate of Analysis is provided with every batch. It is used in GABA-A receptor pharmacology research, benzodiazepine binding studies, triazolobenzodiazepine SAR research, and forensic analytical reference standard development.`,

  // ── RESEARCH CHEMICALS ───────────────────────────────────────────────────

  'crystal-methamphetamine': `Crystal Methamphetamine is the crystalline hydrochloride salt form of methamphetamine, a synthetic compound of the phenethylamine and amphetamine chemical class. First synthesised in 1893 by Nagai Nagayoshi from ephedrine and later produced in crystalline form by Akira Ogata in 1919, methamphetamine has been one of the most extensively studied psychostimulant compounds in neuroscience.

At the molecular level, methamphetamine interacts with the monoamine transporter proteins DAT (dopamine transporter), NET (norepinephrine transporter), and SERT (serotonin transporter), acting as a substrate-type releasing agent and reuptake inhibitor. It additionally disrupts vesicular monoamine transporter 2 (VMAT2) function and inhibits monoamine oxidase (MAO), resulting in elevated synaptic monoamine concentrations. These mechanisms make it a widely used pharmacological tool in studies examining dopaminergic neurotransmission, monoamine transporter biology, stimulant tolerance and dependence, and the neurobiology of addiction. The crystal form represents the recrystallised hydrochloride salt, offering high purity and structural characterisation by X-ray diffraction.

Our Crystal Methamphetamine is produced to 99%+ purity, confirmed by GC-MS and HPLC analysis. A full Certificate of Analysis is provided with every batch. It is used in dopaminergic system research, monoamine transporter pharmacology, addiction neuroscience, and as a certified reference standard in forensic and analytical chemistry.`,

  '3-cmc-3-chloromethcathinone': `3-CMC (3-Chloromethcathinone) is a synthetic cathinone derivative belonging to the beta-keto amphetamine class of compounds. It is the meta-chloro-substituted analogue of methcathinone and is structurally related to cathinone, the principal active constituent of the khat plant (Catha edulis).

3-CMC acts at the monoamine transporter proteins DAT, NET, and SERT, functioning as a substrate-type releasing agent at these transporters. The chloro substituent at the 3-position of the phenyl ring distinguishes its transporter selectivity profile from positional isomers such as 4-CMC, and this difference is documented in comparative in vitro pharmacology studies using radiolabelled substrates and synaptosomal preparations. Structure-activity relationship research within the synthetic cathinone series consistently demonstrates that both the position and nature of ring substituents significantly determine the DAT:SERT selectivity ratio, which is a key parameter in characterising compounds of this class.

Our 3-CMC is produced to 99%+ purity, confirmed by HPLC-MS, NMR spectroscopy, and elemental analysis. A full Certificate of Analysis with spectral data is provided with every order. Applications include monoamine transporter pharmacology, synthetic cathinone SAR research, forensic reference standard development, and analytical method validation.`,

  '4-cmc-4-chloromethcathinone': `4-CMC (4-Chloromethcathinone), also known as Clephedrone, is a synthetic cathinone of the beta-keto amphetamine class. It is the para-chloro positional isomer of 3-CMC and belongs to the same structural series as other well-studied cathinone research compounds.

4-CMC functions as a monoamine releasing agent and reuptake inhibitor at DAT, NET, and SERT. Comparative in vitro pharmacology studies have established that the para-chloro substitution in 4-CMC produces a distinct transporter selectivity profile relative to its 3-position isomer, reflecting the significance of substituent position in determining pharmacological activity within the cathinone series. Its physicochemical properties, analytical characteristics, and metabolic profile have been documented in the peer-reviewed forensic and pharmacological literature, including mass spectrometric fragmentation patterns and NMR spectral data.

Our 4-CMC is manufactured to 99%+ purity, confirmed by HPLC, NMR, and mass spectrometry. A complete Certificate of Analysis with spectral data is provided with every order. It is used in monoamine transporter pharmacology, synthetic cathinone SAR research, forensic reference material libraries, and analytical method development.`,

  '3-mmc-3-methylmethcathinone': `3-MMC (3-Methylmethcathinone) is a synthetic cathinone and a structural isomer of mephedrone (4-MMC), differing in the position of the methyl substituent on the phenyl ring — meta (3-) versus para (4-). It belongs to the beta-keto amphetamine class and is among the synthetic cathinone compounds characterised in pharmacological and forensic research literature.

3-MMC acts as a substrate-type releasing agent at DAT, NET, and SERT monoamine transporters. Comparative in vitro pharmacology data from synaptosomal superfusion experiments demonstrates that the meta-methyl substitution produces a measurably different transporter selectivity ratio compared to the para-methyl isomer (mephedrone), particularly with respect to the relative dopaminergic and serotoninergic components of activity. This SAR comparison provides insight into how minor structural modifications affect the pharmacological profile of substituted cathinones, data that is relevant to both receptor pharmacology and forensic identification.

Our 3-MMC is produced to 99%+ purity, confirmed by HPLC and NMR spectroscopy. A full Certificate of Analysis is included with every batch. It is used in monoamine transporter assays, synthetic cathinone SAR studies, pharmacogenomics research, and as a forensic analytical reference standard.`,

  '4-mmc-mephedrone': `4-MMC, widely known as Mephedrone (4-methylmethcathinone), is a synthetic cathinone of the beta-keto amphetamine class. First synthesised in 1929 by Saem de Burnaga Sanchez, it became one of the most extensively studied synthetic cathinone compounds in the pharmacological and forensic literature following the significant growth of scientific interest in this compound class from 2009 onwards.

Mephedrone acts as a non-selective monoamine releasing agent with documented activity at DAT, NET, and SERT. Its distinctive feature within the synthetic cathinone series is a transporter selectivity profile that shows proportionally higher SERT activity compared to amphetamine, placing it closer to MDMA in its relative dopaminergic-to-serotoninergic activity ratio. This selectivity profile has made mephedrone one of the most important reference compounds for establishing transporter selectivity benchmarks in the cathinone class. Its pharmacokinetics — including N-demethylation, ring hydroxylation, and beta-keto reduction — have been thoroughly characterised in both human and animal metabolic studies, and its metabolites are documented as analytical reference materials.

Our 4-MMC is produced to 99%+ purity, confirmed by HPLC-MS, ¹H and ¹³C NMR, and elemental analysis. A complete Certificate of Analysis with full spectral data is provided with every order. Applications include monoamine transporter pharmacology, synthetic cathinone SAR research, forensic toxicology reference standards, and metabolic pathway studies.`,

  'alpha-pihp': `α-PiHP (Alpha-pyrrolidinoisohexiophenone) is a synthetic cathinone of the pyrrolidinophenone subclass. It is structurally characterised by a pyrrolidine ring at the alpha carbon and an isobutyl side chain, making it a branched-chain analogue of α-PHP and a close structural relative of α-PVP within the pyrrolidinophenone series.

Pyrrolidinophenone cathinones, including α-PiHP, are pharmacologically classified as catecholamine reuptake inhibitors rather than substrate-type releasing agents. They act at DAT and NET with minimal SERT involvement — a selectivity profile that distinguishes them mechanistically from substrate-type cathinones such as mephedrone. The branched isobutyl chain of α-PiHP introduces structural differences relative to its linear-chain analogues (α-PHP, α-PVP) that affect the compound's interaction with the DAT binding site, with consequences for binding affinity and inhibitory potency that have been studied in comparative in vitro DAT inhibition assays.

Our α-PiHP is produced to 99%+ purity, verified by HPLC-MS and NMR spectroscopy. A full Certificate of Analysis with spectroscopic data is provided with every batch. It is used in monoamine transporter inhibition research, pyrrolidinophenone SAR studies, forensic reference standard development, and analytical method validation.`,

  'ketamine-crystal': `Ketamine is a dissociative anaesthetic compound of the arylcyclohexylamine class, first synthesised in 1962 by Calvin Lee Stevens at Parke-Davis laboratories. It was introduced into clinical and research use in the 1970s and has since become one of the most scientifically significant and broadly studied pharmacological agents, with an extensive body of published research spanning multiple disciplines.

Ketamine's principal mechanism of action is as a non-competitive, open-channel blocker of N-methyl-D-aspartate (NMDA) receptors — ionotropic glutamate receptors that play central roles in synaptic plasticity, nociception, and the modulation of neural network activity. By blocking NMDA receptors in a use-dependent manner, ketamine produces defined alterations in glutamatergic neurotransmission that are the subject of active research in anaesthesiology, chronic pain pharmacology, and neuropsychiatric drug development. Beyond NMDA antagonism, ketamine has documented interactions with sigma receptors, opioid receptors, muscarinic acetylcholine receptors, and monoamine reuptake transporters — a multi-target profile that continues to attract significant research attention.

The crystal form represents the recrystallised hydrochloride salt, confirmed by X-ray powder diffraction. Our Ketamine Crystal is produced to 99%+ purity, confirmed by HPLC, NMR spectroscopy, and elemental analysis, supplied as the racemic mixture. A full Certificate of Analysis is provided with every order. It is used in NMDA receptor pharmacology, anaesthesia research, pain pharmacology, neuropsychiatric drug studies, and as a certified reference standard in analytical chemistry.`,

  'alpha-pvp': `α-PVP (Alpha-pyrrolidinopentiophenone), designated O-2387 in the scientific literature, is a synthetic cathinone of the pyrrolidinophenone class. It was first synthesised in the 1960s and represents one of the most extensively pharmacologically characterised compounds in the pyrrolidinophenone series, serving as a key reference compound for this structural class.

α-PVP acts as a potent and selective catecholamine reuptake inhibitor, blocking DAT and NET with high affinity while showing minimal SERT activity. This high DAT/NET selectivity with low SERT involvement distinguishes it pharmacologically from substrate-type cathinones and makes it a valuable tool for studying specific dopaminergic and noradrenergic neurotransmission independently of serotonergic involvement. In vitro DAT inhibition studies using radiolabelled substrates have quantified its binding affinity in the nanomolar range, with published data placing its potency comparable to cocaine in certain assay systems. Its slower DAT dissociation kinetics compared to cocaine are also documented, contributing to differences in the pharmacological time-course profile studied in comparative transporter kinetics research.

Our α-PVP is produced to 99%+ purity, confirmed by HPLC-MS, NMR spectroscopy, and elemental analysis. A complete Certificate of Analysis with full spectral data is provided with every batch. Applications include dopamine and norepinephrine transporter pharmacology, pyrrolidinophenone SAR research, forensic reference standard development, and comparative transporter kinetics studies.`,

  // ── CANNABINOIDS ─────────────────────────────────────────────────────────

  '5-cl-adba': `5-CL-ADBA, formally designated (S)-N-(adamantan-1-yl)-1-(5-chloropentyl)-1H-indazole-3-carboxamide, is a synthetic cannabinoid of the indazole-3-carboxamide class. It is among the most extensively characterised third-generation synthetic cannabinoids and is established as a standard reference compound in cannabinoid receptor research and forensic analytical chemistry.

5-CL-ADBA acts as a full agonist at cannabinoid receptor type 1 (CB1) and cannabinoid receptor type 2 (CB2). The indazole ring system replaces the indole scaffold used in earlier synthetic cannabinoids, and the adamantyl carboxamide group provides the high-affinity binding interaction with the orthosteric cannabinoid receptor binding site. The 5-chloropentyl chain at N1 has been identified in SAR studies as a critical structural determinant of CB1 binding affinity. 5-CL-ADBA's analytical fingerprint — including its mass spectrometric fragmentation pattern, NMR chemical shift assignments, and chromatographic behaviour — is thoroughly documented in forensic chemistry databases and peer-reviewed publications.

Our 5-CL-ADBA is manufactured to 99%+ purity, confirmed by HPLC-MS, ¹H and ¹³C NMR, and elemental analysis. A full Certificate of Analysis with complete spectral data is provided with every order. Applications include cannabinoid receptor pharmacology, forensic toxicology reference standards, analytical method development, and SAR studies of the indazole-3-carboxamide series.`,

  '5-fadb': `5-FADB, also designated MDMB-5F-PINACA, is a synthetic cannabinoid of the indazole-3-carboxamide class. It features a tert-leucine methyl ester (ADB) pharmacophore at the carboxamide nitrogen and a 5-fluoropentyl chain at the N1 position of the indazole ring — a combination that has been studied in the context of high-affinity cannabinoid receptor binding within the indazole series.

5-FADB is a full agonist at CB1 and CB2 cannabinoid receptors. The fluorine atom at the terminal position of the pentyl chain is of particular research interest: the C–F bond is highly resistant to metabolic oxidation, influencing the compound's in vitro metabolic stability compared to non-fluorinated analogues. This fluorine substitution also affects the compound's physicochemical properties, including its lipophilicity. Metabolic studies using human liver microsomes and recombinant CYP enzymes have characterised primary metabolic routes including ester hydrolysis, fluoropentyl chain hydroxylation, and N-dealkylation — data that is documented in forensic pharmacokinetics literature.

Our 5-FADB is produced to 99%+ purity, confirmed by HPLC-MS, multinuclear NMR, and elemental analysis. A complete Certificate of Analysis with spectral data is included with every batch. Applications include cannabinoid receptor pharmacology, metabolic stability research, forensic reference material development, and analytical method validation.`,

  '6-cl-adba': `6-CL-ADBA is a synthetic cannabinoid of the indazole-3-carboxamide class, structurally analogous to 5-CL-ADBA but distinguished by the presence of a 6-chlorohexyl chain at the N1 position of the indazole ring, in place of the 5-chloropentyl chain of its isomer. This single additional carbon in the N1-alkyl chain represents a defined structural modification that has measurable consequences for CB1 receptor binding affinity and pharmacokinetic properties.

The relationship between N1-alkyl chain length and cannabinoid receptor binding affinity is among the most systematically studied SAR parameters in the indazole-3-carboxamide synthetic cannabinoid series. Comparative data from receptor binding assays and functional studies demonstrates that 6-CL-ADBA has a distinct pharmacological profile relative to 5-CL-ADBA, providing insight into the three-dimensional geometry of the CB1 receptor binding pocket. Like other members of the indazole-3-carboxamide class, 6-CL-ADBA acts as a full agonist at both CB1 and CB2 receptor subtypes, activating Gi/Go-coupled intracellular signalling cascades. Its mass spectrometric fragmentation pattern and chromatographic properties are documented in forensic chemistry reference databases.

Our 6-CL-ADBA is produced to 99%+ purity, confirmed by HPLC-MS and NMR spectroscopy. A full Certificate of Analysis is provided with every order. Applications include cannabinoid receptor SAR research, forensic analytical reference standards, and comparative studies of N1-alkyl chain length within the indazole-3-carboxamide class.`,

  'jwh-018': `JWH-018, formally 1-pentyl-3-(1-naphthoyl)indole, also designated AM-678, is one of the most historically significant synthetic cannabinoids in the scientific literature. It was synthesised in 1995 by Dr. John W. Huffman and colleagues at Clemson University as part of a systematic programme to develop pharmacological tools for investigating the endocannabinoid system. The compound is named after Dr. Huffman's initials and was the 18th compound in his published research series.

JWH-018 is an aminoalkylindole (AAI) cannabinoid that acts as a full agonist at both CB1 and CB2 receptors. Competitive radioligand binding studies have established its affinity at both receptor subtypes, with documented Ki values in the nanomolar range. As the founding compound of the naphthoylindole series, JWH-018's chemical scaffold defined the structural template for a generation of synthetic cannabinoid SAR research. Extensive published data covers its receptor pharmacology, in vitro and in vivo metabolic profile (including monohydroxylation and carboxylation of the pentyl chain), and analytical characterisation methods. It has been the subject of several hundred published scientific studies across receptor pharmacology, metabolite identification, analytical detection, and behavioural pharmacology.

Our JWH-018 is produced to 99%+ purity, confirmed by HPLC-MS, ¹H NMR, ¹³C NMR, and elemental analysis. A full Certificate of Analysis with spectral data is provided with every batch. Applications include CB1/CB2 receptor pharmacology, endocannabinoid system research, analytical reference standards, and naphthoylindole SAR studies.`,

  'adb-butinaca': `ADB-BUTINACA, formally N-(1-amino-3,3-dimethyl-1-oxobutan-2-yl)-1-butyl-1H-indazole-3-carboxamide, also known as ADBICA, is a synthetic cannabinoid of the indazole-3-carboxamide class belonging to the ADB (tert-leucinamide) pharmacophore series. This pharmacophore series has been consistently identified in SAR research as producing high-affinity CB1 receptor binding within the indazole scaffold.

ADB-BUTINACA features a butyl chain at the N1 position of the indazole ring, distinguishing it from related compounds such as 5-FADB or ADB-FUBINACA, which carry longer or functionalised alkyl chains. This structural difference enables systematic comparison of N1-alkyl chain length effects within the ADB-indazole series — a key parameter in understanding cannabinoid receptor binding geometry. As a full agonist at CB1 receptors, ADB-BUTINACA activates Gi/Go-coupled signalling pathways including cAMP suppression, MAPK/ERK modulation, and ion channel regulation. Its in vitro metabolism has been characterised using hepatic microsomes, with hydroxylation and amide hydrolysis identified as primary routes. Metabolic products have been documented as forensic analytical reference materials.

Our ADB-BUTINACA is produced to 99%+ purity, confirmed by HPLC-MS, NMR spectroscopy, and elemental analysis. A comprehensive Certificate of Analysis with full spectral documentation is provided with every order. Applications include CB1/CB2 receptor pharmacology, forensic toxicology reference standards, analytical method development, and ADB-series SAR research.`,
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  let updated = 0, notFound = 0;
  for (const [slug, description] of Object.entries(descriptions)) {
    const result = await Product.updateOne({ slug }, { $set: { description } });
    if (result.matchedCount === 0) {
      console.log(`NOT FOUND: ${slug}`);
      notFound++;
    } else {
      console.log(`UPDATED: ${slug}`);
      updated++;
    }
  }

  console.log(`\nDone — ${updated} updated, ${notFound} not found.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
