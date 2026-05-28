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
  'morphine-sulfate': `Morphine Sulfate is the gold-standard opioid analgesic and the primary active alkaloid extracted from the opium poppy (Papaver somniferum). First isolated in 1804 by German pharmacist Friedrich Sertürner, morphine has over two centuries of documented pharmacological history, making it one of the most extensively studied compounds in medical science.

Morphine exerts its effects by binding selectively to mu-opioid receptors (MOR) in the central and peripheral nervous system, producing potent analgesia, sedation, and euphoria. It also acts on kappa and delta opioid receptors to a lesser extent. The compound inhibits the release of neurotransmitters such as substance P, which is responsible for transmitting pain signals, thereby producing a profound reduction in the perception of pain.

Chemically, morphine sulfate is the sulfate salt form of morphine, with the molecular formula (C₁₇H₁₉NO₃)₂·H₂SO₄. This salt form improves water solubility and stability, making it ideal for precise research applications. Our morphine sulfate is produced to pharmaceutical-grade standards, with a purity of 99%+ confirmed by high-performance liquid chromatography (HPLC) and nuclear magnetic resonance (NMR) spectroscopy.

Morphine has been the subject of thousands of scientific studies exploring opioid receptor pharmacology, pain physiology, tolerance and dependence mechanisms, and the development of novel analgesic agents. Its receptor binding profile serves as the benchmark against which all other opioid compounds are evaluated. Researchers studying the opioid system frequently use morphine sulfate as a reference standard in binding assays, behavioural studies, and biochemical experiments.

Each batch is accompanied by a full Certificate of Analysis (CoA) detailing purity, appearance, solubility, and spectroscopic data. Our product is available in multiple gram quantities to suit both small-scale studies and larger research programmes.`,

  'heroin-diacetylmorphine': `Heroin, chemically known as diacetylmorphine or 3,6-diacetylmorphine, is the diacetyl ester derivative of morphine. It was first synthesized in 1874 by C.R. Alder Wright and later commercially developed by Bayer AG in 1898, where it was initially marketed as a "non-addictive" substitute for morphine — a claim that was quickly disproven.

Pharmacologically, heroin itself is a prodrug. Upon entering the body, it is rapidly deacetylated, first to 6-monoacetylmorphine (6-MAM) and then to morphine, which is the primary active metabolite responsible for its opioid effects. The acetyl groups on the morphine molecule dramatically increase lipophilicity, allowing heroin to cross the blood-brain barrier approximately two to three times faster than morphine, producing a faster onset and more intense initial effect.

Heroin binds to mu, kappa, and delta opioid receptors, with the highest affinity for the mu receptor. The compound's pharmacokinetics — including its rapid CNS penetration, conversion pathway, and receptor dynamics — make it a valuable research subject in the fields of addiction neuroscience, opioid receptor pharmacology, and drug metabolism studies.

Our diacetylmorphine is synthesized to a minimum purity of 99%+, verified by HPLC-MS and NMR analysis. Each batch is rigorously tested for residual solvents, heavy metals, and related impurities to ensure research-grade quality. A full Certificate of Analysis is provided with every order.

This compound has been widely used in studies examining opioid dependence, withdrawal mechanisms, reward circuitry in the brain, and the neurobiological basis of addiction. Its well-characterised pharmacological profile makes it an essential reference compound in opioid research.`,

  'codeine-phosphate': `Codeine Phosphate is a naturally occurring opiate alkaloid found in the opium poppy (Papaver somniferum), typically present at concentrations of 0.3–3% in raw opium. It belongs to the phenanthrene class of opioids and is structurally related to morphine, differing only by the presence of a methyl group on the 3-hydroxyl position.

Codeine is primarily a prodrug. Following oral or parenteral administration, it is O-demethylated in the liver by the cytochrome P450 enzyme CYP2D6 to produce morphine, which is responsible for the majority of its analgesic activity. This metabolic pathway is the subject of considerable pharmacogenomic research, as individuals with different CYP2D6 genotypes — poor metabolisers, extensive metabolisers, and ultrarapid metabolisers — experience markedly different responses to codeine. This makes codeine phosphate particularly valuable in pharmacogenomics research.

Codeine also acts directly on the cough centre in the medulla oblongata, making it one of the most studied antitussive agents. It has a lower affinity for opioid receptors compared to morphine, which contributes to its different pharmacological and safety profile.

Chemically, codeine phosphate is the phosphate salt of codeine (molecular formula C₁₈H₂₁NO₃·H₃PO₄), offering improved water solubility and stability over the free base form. Our product is produced to 99%+ purity, confirmed by HPLC and NMR analysis, and is available with a full Certificate of Analysis.

Codeine phosphate is widely used as a reference standard in opioid receptor studies, metabolic enzyme assays, pain research models, and pharmacokinetic investigations. Its well-known metabolic pathway and receptor activity profile make it indispensable in comparative opioid pharmacology.`,

  'oxycodone-hcl': `Oxycodone Hydrochloride is a semi-synthetic opioid analgesic derived from thebaine, an alkaloid of the opium poppy. It was first synthesized in Germany in 1916 by Martin Freund and Edmund Speyer at the University of Frankfurt as part of efforts to develop analgesics with improved properties over morphine and heroin.

Oxycodone acts as a full agonist at mu-opioid receptors, and to a lesser extent at kappa and delta receptors. Compared to morphine, oxycodone has a higher oral bioavailability (approximately 60–87%), a more predictable pharmacokinetic profile, and is less susceptible to first-pass metabolism. These properties have made it a frequently studied compound in pain pharmacology, opioid receptor research, and drug abuse science.

At the molecular level, oxycodone binds to opioid receptors to activate G-protein coupled signalling cascades that inhibit adenylyl cyclase, reduce calcium conductance, and increase potassium conductance — all of which contribute to the suppression of neuronal activity and pain signal transmission. The compound also modulates the release of dopamine in the mesolimbic reward pathway, which underlies its abuse potential and makes it a critical subject in addiction research.

Our oxycodone HCl is produced to a minimum purity of 99%+, verified by HPLC-UV and NMR spectroscopy. The hydrochloride salt form ensures excellent aqueous solubility, suitable for a range of research formulations. Each batch comes with a complete Certificate of Analysis including spectral data.

Oxycodone HCl is extensively used as a reference standard in analytical chemistry, receptor pharmacology, pharmacokinetic modelling, tolerance and dependence studies, and development of abuse-deterrent formulations.`,

  'hydrocodone-bitartrate': `Hydrocodone Bitartrate is a semi-synthetic opioid derived from codeine through O-methylation, first synthesised in Germany in 1920 by Carl Mannich and Helene Löwenheim. It is structurally related to both codeine and morphine and shares many of their pharmacological properties, while exhibiting distinct potency and metabolic characteristics.

Hydrocodone acts primarily as a mu-opioid receptor agonist, with additional activity at kappa and delta receptors. It is a prodrug partially metabolised by CYP2D6 to hydromorphone, which contributes significantly to its analgesic potency. Hydrocodone also inhibits coughing by acting on the brainstem's cough centre, making it the subject of extensive antitussive research as well as analgesic studies.

The bitartrate salt form — the most widely used pharmaceutical form of hydrocodone — provides excellent water solubility and chemical stability, making it suitable for use in a range of research formulations and analytical procedures. Molecular formula: C₁₈H₂₃NO₃·C₄H₆O₆.

Our hydrocodone bitartrate is manufactured to 99%+ purity, confirmed by HPLC and NMR analysis. Comprehensive testing for related substances, residual solvents, and elemental impurities is performed on every batch. A full Certificate of Analysis is included with each order.

This compound is a valuable tool in pharmacogenomic research examining CYP2D6 polymorphisms, comparative opioid receptor binding studies, pain model research, and the investigation of opioid tolerance and physical dependence mechanisms. It is also widely used as a certified reference material in analytical testing laboratories.`,

  'fentanyl-citrate': `Fentanyl Citrate is a highly potent synthetic opioid of the 4-anilidopiperidine class, first synthesised in 1960 by Belgian chemist Paul Janssen at Janssen Pharmaceutica. It is estimated to be 80 to 100 times more potent than morphine on a weight-for-weight basis, a property that has made it central to both clinical anaesthesiology and opioid pharmacology research.

Fentanyl acts as a selective full agonist at mu-opioid receptors (MOR). Its high lipophilicity allows for rapid penetration of the blood-brain barrier, resulting in a fast onset of action — typically within 1–2 minutes when administered parenterally. Despite its rapid onset, fentanyl has a relatively short duration of action due to redistribution from the CNS to other tissues, making its pharmacokinetic profile distinctly different from morphine and other less lipophilic opioids.

At the molecular level, fentanyl's interaction with the MOR activates inhibitory G-proteins (Gi/Go), leading to decreased cAMP production, inhibition of voltage-gated calcium channels, and activation of inwardly rectifying potassium channels. This results in reduced neuronal excitability and profound analgesia. The compound also activates beta-arrestin pathways, which are linked to opioid tolerance and side effects — making fentanyl a critical subject in biased agonism research.

The citrate salt form improves water solubility significantly compared to the fentanyl free base, with a molecular formula of C₂₂H₂₈N₂O·C₆H₈O₇. Our fentanyl citrate is produced to a minimum purity of 99%+, confirmed by HPLC-MS, NMR spectroscopy, and elemental analysis. Full Certificate of Analysis provided with every batch.

Fentanyl citrate is widely used in receptor pharmacology, anaesthesia research, pain physiology, opioid tolerance studies, and as a reference standard in forensic and analytical chemistry. Its unparalleled potency and well-characterised receptor interactions make it irreplaceable in opioid research.`,

  'methadone-hcl': `Methadone Hydrochloride is a synthetic opioid of the diphenylheptane class, first developed in Germany in 1937 by Gustav Ehrhart and Max Bockmühl at IG Farben as part of a wartime effort to produce analgesics that did not rely on opium. It possesses a unique pharmacological profile that distinguishes it from classical opioids such as morphine.

Unlike most opioids, methadone acts as a full agonist at both mu-opioid receptors (MOR) and delta-opioid receptors (DOR), and additionally functions as an antagonist at the N-methyl-D-aspartate (NMDA) receptor. This dual mechanism is of significant scientific interest, as NMDA receptor antagonism contributes to methadone's effectiveness in conditions involving opioid tolerance and neuropathic pain, where other opioids may be less effective.

Methadone is characterised by its exceptionally long and variable half-life, ranging from 24 to 59 hours — significantly longer than morphine or oxycodone. This extended duration is the result of high protein binding and accumulation in body tissues, with slow release back into the circulation. The compound is metabolised primarily by CYP3A4 and CYP2D6, and these metabolic interactions are the subject of important pharmacokinetic research.

Our methadone HCl is available as the racemic mixture (d,l-methadone), which is the standard research form, and is produced to 99%+ purity, confirmed by chiral HPLC, NMR spectroscopy, and elemental analysis. A full Certificate of Analysis is provided with every order.

Methadone HCl is widely used in research examining opioid receptor pharmacology, NMDA receptor antagonism, opioid tolerance mechanisms, pharmacokinetic modelling, and the neurobiology of opioid dependence.`,

  'tramadol-hcl': `Tramadol Hydrochloride is an atypical centrally acting analgesic with a unique dual mechanism of action that distinguishes it from classical opioids. Developed by Grünenthal GmbH in Germany and introduced in 1977, tramadol has since become one of the most extensively studied analgesic compounds, with particular scientific interest in its non-opioid analgesic mechanisms.

Tramadol's pharmacology involves two complementary pathways. First, it and its primary active metabolite O-desmethyltramadol (M1) — formed via CYP2D6-mediated O-demethylation — bind to mu-opioid receptors, with M1 having approximately 200 times greater affinity for the MOR than the parent compound. Second, and uniquely among opioids, tramadol inhibits the reuptake of both serotonin and norepinephrine, contributing to descending pain modulation through monoaminergic pathways similar to antidepressant mechanisms.

This dual mechanism makes tramadol a valuable research tool for studying the interplay between opioidergic and monoaminergic systems in pain processing, as well as in understanding why certain pain states respond better to agents with mixed mechanisms. Tramadol's pharmacogenomic profile is also widely studied: CYP2D6 poor metabolisers produce less M1 and experience reduced analgesia, while ultrarapid metabolisers are at risk of increased opioid effects.

The hydrochloride salt form provides excellent aqueous solubility and stability (molecular formula C₁₆H₂₅NO₂·HCl). Our tramadol HCl is produced to 99%+ purity, verified by HPLC, NMR, and mass spectrometry. A full Certificate of Analysis is provided with every batch.

Tramadol HCl is used extensively in pain pharmacology research, pharmacogenomics studies, serotonin-norepinephrine reuptake inhibition assays, analgesic drug development, and comparative opioid receptor binding experiments.`,

  'isotonitazene': `Isotonitazene is a highly potent synthetic opioid belonging to the 2-benzylbenzimidazole (nitazene) class. The nitazene family was first developed in the 1950s and 1960s by researchers at CIBA Pharmaceutical Company in Switzerland, originally in the search for novel analgesics. Isotonitazene is characterised by an isopropyl side chain on the benzimidazole nitrogen and an N,N-diethyl group on the ethylamine side chain.

Isotonitazene acts as a full agonist at mu-opioid receptors with extraordinary potency — estimated to be substantially more potent than morphine and comparable to fentanyl in receptor binding affinity. It also binds to kappa and delta opioid receptors, though with lower affinity. The compound's high lipophilicity facilitates rapid CNS penetration, contributing to its fast onset of pharmacological action.

At the molecular level, isotonitazene activates inhibitory G-proteins coupled to opioid receptors, suppressing adenylyl cyclase activity, reducing intracellular cAMP, inhibiting calcium channels, and opening potassium channels — producing profound analgesia and CNS depression. Its binding kinetics and receptor selectivity have been the focus of considerable pharmacological research since its appearance in scientific literature.

Isotonitazene has been extensively analysed by forensic and analytical chemists worldwide, leading to a rich body of reference spectral data including NMR, IR, and mass spectrometry libraries. Our product is manufactured to 99%+ purity, confirmed by HPLC-MS and multinuclear NMR analysis. Each batch includes a full Certificate of Analysis with complete spectroscopic data.

This compound is a key research subject in synthetic opioid pharmacology, structure-activity relationship (SAR) studies of the benzimidazole class, opioid receptor binding assays, and forensic reference standard development.`,

  'metonitazene': `Metonitazene is a synthetic opioid of the 2-benzylbenzimidazole (nitazene) class, structurally characterised by a methoxy substituent on the para position of the benzyl phenyl ring. Like other members of the nitazene series, it was originally synthesised during mid-20th century pharmaceutical research at CIBA aimed at developing novel non-morphine analgesics.

Metonitazene is a potent mu-opioid receptor full agonist. The methoxy substitution on the benzyl ring influences its receptor binding affinity, lipophilicity, and metabolic stability compared to other nitazene analogues. Structure-activity relationship (SAR) studies within the benzimidazole opioid series demonstrate that para-methoxy substitution enhances mu-opioid receptor affinity relative to unsubstituted analogues, making metonitazene one of the more pharmacologically significant members of this series.

The compound's pharmacological effects parallel those of classical opioids: activation of Gi/Go-coupled opioid receptors leads to suppression of adenylyl cyclase, inhibition of voltage-gated calcium channels, and potassium channel opening, collectively reducing neuronal excitability and pain signal transmission. Metonitazene is metabolised in vitro via N-dealkylation and O-demethylation pathways, and its metabolic profile is an active area of forensic and pharmacokinetic research.

Our metonitazene is produced to 99%+ purity, confirmed by HPLC-MS, ¹H NMR, ¹³C NMR, and elemental analysis. Full spectroscopic documentation and a Certificate of Analysis are provided with every batch.

Metonitazene is used in opioid receptor pharmacology, benzimidazole SAR research, forensic reference material development, analytical method validation, and comparative potency studies within the nitazene compound class.`,

  'protonitazene': `Protonitazene is a member of the 2-benzylbenzimidazole class of synthetic opioids, structurally featuring a propyl group on the benzimidazole nitrogen. The compound belongs to the same series of nitazene opioids first synthesised by CIBA researchers in Switzerland during the 1950s, with the original aim of producing potent non-opiate analgesics for potential clinical use.

Protonitazene is a full agonist at mu-opioid receptors and demonstrates potent opioid receptor activity. The propyl chain on the benzimidazole nitrogen affects its pharmacokinetic properties, including its lipophilicity and rate of CNS penetration, which distinguishes it from closely related analogues such as isotonitazene and metonitazene. Comparative receptor binding data shows that chain length and branching at this position are critical determinants of potency within the nitazene series.

The compound operates through the classic opioid receptor signalling cascade: activation of mu-opioid receptors triggers inhibitory G-protein pathways, reducing neuronal activity, suppressing nociceptive signalling, and producing pronounced analgesia. Protonitazene's pharmacological and metabolic properties make it a valuable data point in the broader SAR analysis of 2-benzylbenzimidazole opioids.

Our protonitazene is manufactured to 99%+ purity, confirmed by HPLC-MS and NMR spectroscopy. Each batch is tested for related impurities, residual solvents, and elemental contaminants, and is supplied with a comprehensive Certificate of Analysis.

Protonitazene is used in structure-activity relationship studies of the nitazene class, mu-opioid receptor binding assays, forensic analytical method development, and comparative pharmacological research examining the role of N-alkyl chain length on opioid receptor affinity and potency.`,

  'butonitazene': `Butonitazene is a synthetic opioid of the 2-benzylbenzimidazole (nitazene) class, characterised by the presence of a butyl substituent on the benzimidazole nitrogen atom. It is part of the broader family of nitazene compounds first synthesised at CIBA Pharmaceutical Company in the 1950s, a series of compounds designed to probe the structural determinants of opioid analgesia.

As a full mu-opioid receptor agonist, butonitazene produces effects consistent with the opioid class: analgesia, sedation, respiratory depression, and modulation of the mesolimbic reward pathway. The butyl chain at the benzimidazole nitrogen influences the compound's lipophilicity and protein binding characteristics, properties that directly affect its pharmacokinetic behaviour and CNS bioavailability compared to shorter-chain analogues such as protonitazene or longer-chain variants.

In the context of structure-activity relationship (SAR) research within the nitazene series, butonitazene provides a critical data point for understanding how increasing the length of the N-alkyl substituent modulates receptor affinity, selectivity, and functional potency. Such SAR data is foundational to the rational design of novel opioid analgesics and to understanding the molecular pharmacology of the benzimidazole opioid scaffold.

Our butonitazene is produced to 99%+ purity, verified by reverse-phase HPLC-MS, multinuclear NMR spectroscopy (¹H and ¹³C), and elemental analysis. Comprehensive purity testing is performed on every batch, and a full Certificate of Analysis is supplied with each order.

Butonitazene is used in opioid SAR research, mu-opioid receptor binding and functional assays, forensic reference standard libraries, analytical chemistry method validation, and comparative studies of N-alkyl chain length effects in the 2-benzylbenzimidazole series.`,

  'etonitazene': `Etonitazene is one of the most historically significant compounds in synthetic opioid pharmacology. First synthesised in 1957 by researchers at CIBA Pharmaceutical Company in Basel, Switzerland, etonitazene was among the earliest 2-benzylbenzimidazole opioids to be characterised and has served as the foundational reference compound for the entire nitazene class.

Etonitazene is a full, high-efficacy agonist at mu-opioid receptors and is recognised as one of the most potent opioid compounds ever studied, with estimates of its potency ranging from approximately 1,000 to 1,500 times that of morphine in rodent analgesia models. This extraordinary potency arises from its unique benzimidazole scaffold, which allows tight binding to the opioid receptor binding pocket with a particularly high affinity (Ki values in the picomolar range have been reported in some receptor preparations).

The compound features an ethoxy group on the para position of the phenyl ring and an N,N-diethylaminoethyl side chain — structural features that have been repeatedly identified in SAR studies as critical contributors to its high receptor binding affinity. Etonitazene's pharmacological profile has been extensively documented over decades of research, making it the most characterised benchmark compound in the nitazene series.

Our etonitazene is manufactured to 99%+ purity, confirmed by HPLC-MS, ¹H and ¹³C NMR spectroscopy, infrared spectroscopy, and elemental analysis. A comprehensive Certificate of Analysis is included with every order.

Etonitazene is an essential reference compound in opioid receptor pharmacology, radioligand binding studies (it is commonly used as a competitor in ³H-naloxone binding assays), structure-activity relationship research, and the development of forensic and analytical reference standards for the nitazene class.`,

  'etodesnitazene': `Etodesnitazene, also known as etazene or desnitazetene, is a synthetic opioid of the 2-benzylbenzimidazole class. It is structurally related to etonitazene but lacks the nitro group at the 5-position of the benzimidazole ring — a key structural difference that significantly influences its pharmacological properties and receptor binding characteristics compared to classic nitazene analogues.

The removal of the nitro group in etodesnitazene compared to etonitazene provides an important data point in the structure-activity relationship of benzimidazole opioids. Studies examining this structural modification have shown that while the nitro group contributes significantly to receptor affinity in the parent compound, etodesnitazene retains potent mu-opioid receptor agonist activity, demonstrating that high potency in the nitazene series is not exclusively dependent on the presence of the nitro substituent.

Etodesnitazene activates mu-opioid receptors through the canonical Gi/Go-protein-coupled signalling pathway, resulting in inhibition of adenylyl cyclase, reduced cAMP levels, modulation of calcium and potassium channel conductance, and downstream suppression of neuronal firing and pain signal transmission. Its metabolic pathway — involving N-deethylation and aromatic hydroxylation — has been characterised using in vitro hepatic microsome preparations, data from which is valuable for forensic and pharmacokinetic studies.

Our etodesnitazene is produced to 99%+ purity, verified by HPLC-MS, multinuclear NMR, and elemental analysis. A full Certificate of Analysis with complete spectral data is supplied with every batch.

Etodesnitazene is used in nitazene SAR research, forensic reference material libraries, mu-opioid receptor pharmacology, comparative metabolism studies, and analytical method development for the detection and quantification of benzimidazole opioids.`,

  'n-pyrrolidino-etonitazene': `N-Pyrrolidino Etonitazene is a structural analogue of etonitazene in which the N,N-diethylaminoethyl side chain is replaced by a pyrrolidine-containing moiety. This modification represents a significant structural departure from the classical nitazene side chain and is of particular interest in SAR research examining the role of the amine substituent in determining opioid receptor binding affinity and functional activity.

The incorporation of the pyrrolidine ring — a five-membered saturated nitrogen-containing heterocycle — introduces conformational constraints on the side chain that influence how the molecule interacts with the opioid receptor binding pocket. Comparative data from receptor binding studies suggests that cyclic amine substituents in this position can produce compounds with altered selectivity profiles, binding kinetics, and intrinsic efficacies at mu, kappa, and delta opioid receptors compared to their linear amine counterparts.

N-Pyrrolidino etonitazene retains the core 2-benzylbenzimidazole scaffold and the ethoxy substituent on the para position of the phenyl ring that are characteristic of the etonitazene series, allowing direct comparison of the impact of N-side chain modification while holding other structural variables constant. This makes it a uniquely valuable tool for mapping the opioid receptor binding site and understanding the steric and electronic requirements of high-affinity binding.

Our N-pyrrolidino etonitazene is produced to 99%+ purity, confirmed by HPLC-MS, ¹H and ¹³C NMR, and elemental analysis. Full spectroscopic data and a Certificate of Analysis are provided with every order.

This compound is used in advanced benzimidazole opioid SAR research, mu-opioid receptor pharmacology, forensic reference standard development, and studies investigating the influence of cyclic versus linear amine substituents on opioid receptor binding and activity.`,

  'bromazolam': `Bromazolam is a synthetic compound belonging to the triazolobenzodiazepine class — a group of pharmacologically active substances characterised by the fusion of a benzene ring, a seven-membered diazepine ring, and a 1,2,4-triazole ring. It is structurally related to well-known benzodiazepines and shares their core mechanism of action while displaying a distinct potency and duration profile.

Bromazolam acts as a positive allosteric modulator of the gamma-aminobutyric acid type A (GABA-A) receptor. It binds to the benzodiazepine recognition site located between the alpha and gamma subunits of the GABA-A receptor complex, enhancing the inhibitory effects of GABA — the primary inhibitory neurotransmitter in the central nervous system. This results in increased chloride ion conductance, hyperpolarisation of the neuronal membrane, and a general reduction in neuronal excitability.

The pharmacological profile of bromazolam includes sedative, anxiolytic, hypnotic, anticonvulsant, and muscle relaxant properties, consistent with the broader benzodiazepine class. The incorporation of the triazole ring in the triazolobenzodiazepine structure generally enhances receptor binding affinity and metabolic stability compared to classical benzodiazepines, contributing to bromazolam's potency and duration of action.

The compound features a bromo substituent at the 8-position of the diazepine ring and a phenyl group, giving it a distinct physicochemical profile. It is lipophilic, with good CNS penetration, and is metabolised primarily via hydroxylation and glucuronidation. Its metabolic breakdown products have been characterised and documented in the analytical chemistry literature.

Our bromazolam is produced to 99%+ purity, confirmed by HPLC, NMR spectroscopy, and mass spectrometry. A comprehensive Certificate of Analysis is provided with every batch, including full spectral data.

Bromazolam is used in GABA-A receptor pharmacology research, benzodiazepine binding studies, comparative potency assessments within the triazolobenzodiazepine series, and forensic analytical reference standard development.`,
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
