import type { Category, Product } from '../types';

export const mockCategories: Omit<Category, 'productCount'>[] = [
    { slug: 'free-weights', name: 'Free Weights' },
    { slug: 'lifting-accessories', name: 'Lifting Accessories' },
    { slug: 'apparel', name: 'Athletic Apparel' },
    { slug: 'nutrition', name: 'Sports Nutrition' },
];

type Seed = Omit<Product, 'id' | 'slug' | 'categorySlug'>;

const seeds: Record<string, Seed[]> = {
    'free-weights': [
        {
            name: 'Hex Dumbbell 10 kg', priceCents: 18900, stock: 24, highlight: '10 kg',
            description: 'Rubber-coated hex head that stays put on the floor. Knurled chrome handle.',
            specs: { Weight: '10 kg', Handle: '32 mm chrome, knurled', Head: 'Hexagonal, rubber-coated' }
        },
        {
            name: 'Hex Dumbbell 20 kg', priceCents: 34900, stock: 12, highlight: '20 kg',
            description: 'The same hex design in a heavier size for rows, presses and lunges.',
            specs: { Weight: '20 kg', Handle: '34 mm chrome, knurled', Head: 'Hexagonal, rubber-coated' }
        },
        {
            name: 'Adjustable Dumbbell 2–24 kg', priceCents: 124900, stock: 3, highlight: '24 kg',
            description: 'Fifteen weights in one dumbbell. Turn the dial to switch load in seconds.',
            specs: { Range: '2–24 kg', Increments: '15 settings', Footprint: '42 × 21 cm' }
        },
        {
            name: 'Olympic Power Bar 20 kg', priceCents: 149900, stock: 6, highlight: '20 kg',
            description: 'Stiff 29 mm power bar with aggressive knurl and centre knurl for squats.',
            specs: { Weight: '20 kg', Length: '220 cm', Shaft: '29 mm', 'Tensile strength': '1,500 MPa', Knurl: 'IPF marks, centre knurl' }
        },
        {
            name: 'Fractional Plate Set 0.25–1 kg', priceCents: 24900, stock: 18, highlight: '0.25 kg',
            description: 'Small jumps for slow, steady progress on presses and bench.',
            specs: { Plates: '2 × 0.25, 0.5, 0.75, 1 kg', Total: '5 kg', Bore: '50 mm' }
        },
        {
            name: 'Bumper Plate 20 kg', priceCents: 45900, stock: 0, highlight: '20 kg',
            description: 'Dense virgin rubber with a steel insert. Safe to drop from overhead.',
            specs: { Weight: '20 kg', Diameter: '450 mm', Bore: '50.4 mm steel insert', Tolerance: '±1%' }
        },
        {
            name: 'Cast Iron Kettlebell 16 kg', priceCents: 22900, stock: 15, highlight: '16 kg',
            description: 'Single-piece cast iron with a smooth, wide handle for two-hand swings.',
            specs: { Weight: '16 kg', Material: 'Cast iron, powder coat', 'Handle diameter': '35 mm' }
        },
        {
            name: 'Cast Iron Kettlebell 24 kg', priceCents: 31900, stock: 7, highlight: '24 kg',
            description: 'The standard bell for heavy swings, cleans and goblet squats.',
            specs: { Weight: '24 kg', Material: 'Cast iron, powder coat', 'Handle diameter': '38 mm' }
        },
    ],
    'lifting-accessories': [
        {
            name: 'Lever Belt 10 mm', priceCents: 39900, stock: 9, highlight: '10 mm',
            description: 'Suede leather belt with a lever buckle that locks in one motion.',
            specs: { Thickness: '10 mm', Width: '10 cm', Material: 'Suede leather', Buckle: 'Steel lever' }
        },
        {
            name: 'Nylon Training Belt', priceCents: 14900, stock: 20, highlight: '4 in',
            description: 'Light, flexible support for Olympic lifts and high-rep work.',
            specs: { Width: '10 cm', Material: 'Nylon', Closure: 'Velcro + buckle' }
        },
        {
            name: 'Neoprene Knee Sleeves 7 mm', priceCents: 22900, stock: 14, highlight: '7 mm',
            description: 'Warm, compressive sleeves for heavy squats. Sold as a pair.',
            specs: { Thickness: '7 mm', Material: 'Neoprene', Quantity: 'Pair' }
        },
        {
            name: 'Heavy Wrist Wraps 60 cm', priceCents: 8900, stock: 30, highlight: '60 cm',
            description: 'Stiff wraps with a thumb loop for pressing and benching heavy.',
            specs: { Length: '60 cm', Stiffness: 'Heavy', Quantity: 'Pair' }
        },
        {
            name: 'Cotton Lifting Straps', priceCents: 5900, stock: 40, highlight: '55 cm',
            description: 'Simple loop straps for deadlifts and rows when grip gives out first.',
            specs: { Length: '55 cm', Material: 'Cotton', Quantity: 'Pair' }
        },
        {
            name: 'Figure-8 Straps', priceCents: 7900, stock: 2, highlight: 'Fig. 8',
            description: 'Locks the bar to your hands for maximal pulls and shrugs.',
            specs: { Material: 'Nylon webbing', Sizes: 'S, M, L', Quantity: 'Pair' }
        },
        {
            name: 'Liquid Chalk 250 ml', priceCents: 4900, stock: 25, highlight: '250 ml',
            description: 'Dries in seconds and leaves a dry grip with no dust.',
            specs: { Volume: '250 ml', Base: 'Alcohol + magnesium carbonate' }
        },
        {
            name: 'Elbow Sleeves 5 mm', priceCents: 17900, stock: 0, highlight: '5 mm',
            description: 'Warmth and light support for pressing days. Sold as a pair.',
            specs: { Thickness: '5 mm', Material: 'Neoprene', Quantity: 'Pair' }
        },
    ],
    apparel: [
        {
            name: 'Oversized Training Hoodie', priceCents: 22900, stock: 16, highlight: '380 gsm',
            description: 'Heavy brushed fleece with dropped shoulders and room to move.',
            specs: { Fabric: '80% cotton, 20% polyester', Weight: '380 gsm', Fit: 'Oversized', Sizes: 'S–XXL' }
        },
        {
            name: 'Compression Long Sleeve', priceCents: 14900, stock: 11, highlight: '220 gsm',
            description: 'Four-way stretch base layer that stays in place under a hoodie.',
            specs: { Fabric: '78% polyamide, 22% elastane', Weight: '220 gsm', Fit: 'Compression', Sizes: 'S–XL' }
        },
        {
            name: 'Seamless Training Tee', priceCents: 11900, stock: 28, highlight: '160 gsm',
            description: 'Light, breathable tee with no seams to rub under a barbell.',
            specs: { Fabric: 'Polyamide blend', Weight: '160 gsm', Fit: 'Regular', Sizes: 'S–XXL' }
        },
        {
            name: 'Lifting Shorts 5 in', priceCents: 12900, stock: 4, highlight: '5 in',
            description: 'Short inseam and a stretch waistband for deep squats.',
            specs: { Inseam: '13 cm', Fabric: 'Stretch woven', Pockets: '2 zipped', Sizes: 'S–XL' }
        },
        {
            name: 'High-Rise Squat Leggings', priceCents: 16900, stock: 19, highlight: '7/8',
            description: 'Opaque, squat-proof fabric with a waistband that does not roll.',
            specs: { Length: '7/8', Rise: 'High', Fabric: '75% nylon, 25% elastane', Sizes: 'XS–XL' }
        },
        {
            name: 'Mesh Stringer Tank', priceCents: 8900, stock: 22, highlight: '140 gsm',
            description: 'Deep-cut tank for hot sessions and full shoulder range.',
            specs: { Fabric: 'Cotton mesh', Weight: '140 gsm', Fit: 'Regular', Sizes: 'S–XXL' }
        },
        {
            name: 'Heavyweight Joggers', priceCents: 18900, stock: 9, highlight: '320 gsm',
            description: 'Tapered fleece joggers with cuffed ankles and a drawcord.',
            specs: { Fabric: '80% cotton, 20% polyester', Weight: '320 gsm', Fit: 'Tapered', Sizes: 'S–XXL' }
        },
        {
            name: 'Knee-High Deadlift Socks', priceCents: 4900, stock: 0, highlight: 'Knee-high',
            description: 'Protect your shins from the bar on every pull.',
            specs: { Height: 'Knee-high', Fabric: 'Cotton blend', Quantity: '2 pairs', Sizes: '39–42, 43–46' }
        },
    ],
    nutrition: [
        {
            name: 'Whey Isolate Chocolate 2 kg', priceCents: 33900, stock: 22, highlight: '2 kg',
            description: 'Cold-filtered isolate that mixes clean with water or milk.',
            specs: { 'Protein per serving': '27 g', Servings: '66', Flavour: 'Chocolate', 'Net weight': '2 kg' }
        },
        {
            name: 'Whey Isolate Vanilla 1 kg', priceCents: 18900, stock: 5, highlight: '1 kg',
            description: 'The same isolate in vanilla, in a smaller tub.',
            specs: { 'Protein per serving': '27 g', Servings: '33', Flavour: 'Vanilla', 'Net weight': '1 kg' }
        },
        {
            name: 'Creatine Monohydrate 500 g', priceCents: 11900, stock: 35, highlight: '500 g',
            description: 'Pure micronised creatine with no flavour and no fillers.',
            specs: { 'Per serving': '5 g', Servings: '100', 'Net weight': '500 g' }
        },
        {
            name: 'Creatine Monohydrate 1 kg', priceCents: 19900, stock: 0, highlight: '1 kg',
            description: 'The large tub of pure micronised creatine.',
            specs: { 'Per serving': '5 g', Servings: '200', 'Net weight': '1 kg' }
        },
        {
            name: 'Electrolyte Mix Lemon', priceCents: 7900, stock: 17, highlight: '20 sticks',
            description: 'Sodium, potassium and magnesium for long, sweaty sessions.',
            specs: { 'Sodium per stick': '500 mg', Servings: '20', Flavour: 'Lemon' }
        },
        {
            name: 'Pre-Workout Citrus 300 g', priceCents: 13900, stock: 8, highlight: '300 g',
            description: 'Caffeine and citrulline for focus and pump before training.',
            specs: { 'Caffeine per serving': '200 mg', Servings: '30', Flavour: 'Citrus', 'Net weight': '300 g' }
        },
        {
            name: 'Micellar Casein 1 kg', priceCents: 17900, stock: 13, highlight: '1 kg',
            description: 'Slow-digesting protein for a shake before bed.',
            specs: { 'Protein per serving': '24 g', Servings: '33', Flavour: 'Cookies & cream', 'Net weight': '1 kg' }
        },
        {
            name: 'Protein Bar Box 12 × 60 g', priceCents: 11900, stock: 26, highlight: '12 × 60 g',
            description: 'Twenty grams of protein in a bar that fits a gym bag.',
            specs: { 'Protein per bar': '20 g', Bars: '12', Flavour: 'Peanut caramel' }
        },
    ],
};

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export const mockProducts: Product[] = Object.entries(seeds)
    .flatMap(([categorySlug, list]) => list.map((seed) => ({ ...seed, categorySlug })))
    .map((product, index) => ({ ...product, id: index + 1, slug: slugify(product.name) }));