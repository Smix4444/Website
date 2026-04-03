// Vercel Serverless: GET /api/products/:id
const products = [
  { id: "void-ring-01", name: "VOID RING I", slug: "void-ring", description: "Melted heavy sterling silver. A raw, visceral statement of entropy cast from the abyss.", price: 28000, category: "rings", image: "/assets/void_ring.webp", details: "Weight: 24g · Material: Oxidized .925 Silver · Handmade in the void · Sizes 6–12" },
  { id: "entropy-chain-01", name: "ENTROPY CHAIN", slug: "entropy-chain", description: "Barbed wire links in brutalist silver. Psychological armor forged in chaos.", price: 54000, category: "chains", image: "/assets/entropy_chain.webp", details: "Length: 50cm · Material: Solid .925 Silver · Individually stressed links · Lobster clasp" },
  { id: "fracture-cuff-01", name: "FRACTURE CUFF", slug: "fracture-cuff", description: "A split silver plate with inner raw texture. Chaos refined for the wrist.", price: 31000, category: "cuffs", image: "/assets/fracture_cuff.webp", details: "Width: 30mm · Elastic tension fit · Hand-sculpted texture · One size fits most" },
  { id: "shroud-pendant-01", name: "SHROUD PENDANT", slug: "shroud-pendant", description: "A heavy oxidized pendant resembling draped bone-white silk frozen in silver.", price: 19000, category: "pendants", image: "/assets/shroud_pendant.webp", details: "Pendant: 45mm · Includes 60cm micro-link chain · Oxidized finish · Unisex" },
  { id: "decay-signet-01", name: "DECAY SIGNET", slug: "decay-signet", description: "An eroded signet ring with a corroded face. Identity dissolved into nothing.", price: 34000, category: "rings", image: "/assets/decay_signet.webp", details: "Weight: 28g · Material: Oxidized .925 Silver · Hand-corroded finish · Sizes 7–11" },
  { id: "schism-earring-01", name: "SCHISM EARRING", slug: "schism-earring", description: "A single fractured silver drop. Asymmetry as philosophy.", price: 16500, category: "earrings", image: "/assets/schism_earring.webp", details: "Length: 35mm · Material: .925 Silver · Single piece · Push-back closure" },
  { id: "wraith-chain-01", name: "WRAITH CHAIN", slug: "wraith-chain", description: "Ultra-fine layered chains that disappear and reappear as you move. A ghost around your neck.", price: 42000, category: "chains", image: "/assets/wraith_chain.webp", details: "Layers: 3 · Lengths: 40/45/50cm · Material: .925 Silver · Micro-link construction" },
  { id: "trauma-ring-01", name: "TRAUMA BAND", slug: "trauma-band", description: "A thick hammered band with deep gouges. Every scar tells a lie.", price: 22000, category: "rings", image: "/assets/trauma_band.webp", details: "Width: 8mm · Weight: 18g · Material: .925 Silver · Hand-hammered · Sizes 6–13" },
  { id: "phantom-cuff-01", name: "PHANTOM CUFF", slug: "phantom-cuff", description: "Razor-thin silver ear cuff. It was never there. You imagined it.", price: 12000, category: "earrings", image: "/assets/phantom_cuff.webp", details: "Width: 2mm · Material: .925 Silver · No piercing required · Adjustable tension" },
  { id: "abyss-collar-01", name: "ABYSS COLLAR", slug: "abyss-collar", description: "A rigid silver collar that sits like a sentence around your throat. Heavy. Final.", price: 78000, category: "chains", image: "/assets/abyss_collar.webp", details: "Diameter: 14cm · Weight: 85g · Material: Solid .925 Silver · Hinge clasp · Limited edition" }
];

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
};
