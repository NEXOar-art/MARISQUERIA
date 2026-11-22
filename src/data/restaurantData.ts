export type MenuCategory =
  | 'Todas'
  | 'Centolla Fueguina'
  | 'Entradas y Picadas'
  | 'Pescados Australes'
  | 'Paellas y Cazuelas'
  | 'Pastas Caseras'
  | 'Carnes y Minutas'
  | 'Postres Regionales'
  | 'Bebidas y Bodega';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'Todas'>;
  description: string;
  price: number;
  highlight?: string;
  tags: string[];
}

export interface GalleryFrame {
  id: string;
  title: string;
  caption: string;
  detail: string;
  src: string;
  objectPosition: string;
  scaleClass: string;
}

export const RESTAURANT_INFO = {
  name: 'La Casa de los Mariscos',
  tagline: 'Marisquería Tradicional · Desde 1994 en el Fin del Mundo',
  address: 'Av. San Martín 232, V9410 Ushuaia, Tierra del Fuego, Argentina',
  shortAddress: 'Av. San Martín 232, Ushuaia',
  phoneDisplay: '+54 9 2901 48-8405',
  whatsappNumber: '5492901488405',
  instagramHandle: '@lacasadelosmariscosushuaia',
  instagramUrl: 'https://www.instagram.com/lacasadelosmariscosushuaia/',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=La+Casa+de+los+Mariscos+Av+San+Martin+232+Ushuaia',
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Av.+San+Mart%C3%ADn+232,+Ushuaia,+Tierra+del+Fuego,+Argentina',
  rating: '4.5',
  reviewCount: '3.963',
  priceRange: '$ 30.000 - 70.000',
  categoryLabel: 'Marisquería',
  hoursLunch: 'Almuerzo: 12:00 a 15:30 hs',
  hoursDinner: 'Cena: 20:00 a 00:00 hs',
  mainPhoto: '/assets/aistudio/CASA_DE_MARISCOS_6db247f6.jpg',
};

export const MENU_CATEGORIES: MenuCategory[] = [
  'Todas',
  'Centolla Fueguina',
  'Entradas y Picadas',
  'Pescados Australes',
  'Paellas y Cazuelas',
  'Pastas Caseras',
  'Carnes y Minutas',
  'Postres Regionales',
  'Bebidas y Bodega',
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Centolla Fueguina
  {
    id: 'centolla-entera-acuario',
    name: 'Centolla Entera de Acuario (Al Natural)',
    category: 'Centolla Fueguina',
    description:
      'Ejemplar vivo seleccionado del salón, cocido en agua de mar con limón fueguino, manteca clarificada y salsa golf casera.',
    price: 68900,
    highlight: 'Especialidad de la Casa',
    tags: ['centolla', 'king crab', 'acuario', 'entera', 'sin tacc'],
  },
  {
    id: 'centolla-gratinada',
    name: 'Centolla Gratinada al Horno',
    category: 'Centolla Fueguina',
    description:
      'Carne fresca de centolla en su caparazón con salsa blanca suave, crema patagónica y queso parmesano gratinado.',
    price: 61500,
    tags: ['centolla', 'gratinada', 'horno', 'queso'],
  },
  {
    id: 'cazuela-centolla-casa',
    name: 'Cazuela de la Casa',
    category: 'Centolla Fueguina',
    description:
      'Generosa cazuela con centolla del Canal Beagle, langostinos enteros, crema reducida y papas torneadas.',
    price: 59900,
    highlight: 'Más Pedida',
    tags: ['centolla', 'langostinos', 'cazuela', 'crema', 'papas'],
  },
  {
    id: 'cazuela-centolla-vieyras',
    name: 'Cazuela de Centolla, Vieyras y Langostinos',
    category: 'Centolla Fueguina',
    description:
      'Trío austral en cocción lenta al vino blanco chardonnay, manteca de hierbas y toque de azafrán.',
    price: 59900,
    tags: ['centolla', 'vieyras', 'langostinos', 'vino blanco'],
  },
  {
    id: 'cazuela-mariscos-centolla',
    name: 'Cazuela de Mariscos y Centolla',
    category: 'Centolla Fueguina',
    description:
      'Guiso marinero con centolla, mejillones, cholgas, calamaretes y caldo artesanal de pescado.',
    price: 52900,
    tags: ['centolla', 'mariscos', 'mejillones', 'cholgas', 'cazuela'],
  },

  // Entradas y Picadas
  {
    id: 'picada-de-la-casa',
    name: 'Picada de la Casa (Para 2 Personas)',
    category: 'Entradas y Picadas',
    description:
      'Degustación para compartir con centolla al natural, mejillones a la provenzal, langostinos, vieyras gratinadas y rabas.',
    price: 56500,
    highlight: 'Para Compartir',
    tags: ['picada', 'compartir', 'centolla', 'rabas', 'langostinos', 'vieyras'],
  },
  {
    id: 'rabas-romana',
    name: 'Rabas a la Romana',
    category: 'Entradas y Picadas',
    description:
      'Anillos tiernos de calamar rebozados al momento, acompañados de gajos de limón y alioli de ajo asado.',
    price: 31500,
    tags: ['rabas', 'calamar', 'frito', 'entrada'],
  },
  {
    id: 'langostinos-ajillo',
    name: 'Langostinos al Ajillo',
    category: 'Entradas y Picadas',
    description:
      'Salteados en aceite de oliva extra virgen, láminas de ajo dorado, perejil fresco y pimienta cayena.',
    price: 34900,
    tags: ['langostinos', 'ajillo', 'camarones', 'sin tacc'],
  },
  {
    id: 'empanadas-centolla',
    name: 'Empanadas de Centolla Fueguina (x2)',
    category: 'Entradas y Picadas',
    description:
      'Masa casera dorada rellena de centolla desmenuzada, cebolla caramelizada y pimiento morrón.',
    price: 29800,
    tags: ['empanadas', 'centolla', 'entrada', 'casera'],
  },
  {
    id: 'mejillones-provenzal',
    name: 'Mejillones del Canal a la Provenzal',
    category: 'Entradas y Picadas',
    description:
      'Mejillones frescos en su valva al vapor de vino blanco con ajo, perejil y pan tostado de campo.',
    price: 29500,
    tags: ['mejillones', 'provenzal', 'canal beagle', 'entrada'],
  },
  {
    id: 'vieyras-gratinadas',
    name: 'Vieyras Gratinadas al Parmesano',
    category: 'Entradas y Picadas',
    description:
      'Media docena de vieyras patagónicas gratinadas con manteca de limón y queso estacionado.',
    price: 33200,
    tags: ['vieyras', 'gratinadas', 'queso', 'entrada'],
  },

  // Pescados Australes
  {
    id: 'merluza-negra-plancha',
    name: 'Merluza Negra Austral a la Plancha',
    category: 'Pescados Australes',
    description:
      'El pescado más preciado del Atlántico Sur, sellado a la plancha con vegetales asados y papas rústicas.',
    price: 49900,
    highlight: 'Emblema Fueguino',
    tags: ['merluza negra', 'black hake', 'plancha', 'pescado', 'sin tacc'],
  },
  {
    id: 'merluza-negra-puerros',
    name: 'Merluza Negra con Crema de Puerros y Camarones',
    category: 'Pescados Australes',
    description:
      'Lomo de merluza negra bañado en velouté de puerros, camarones salteados y papas noisette.',
    price: 54500,
    tags: ['merluza negra', 'crema', 'puerros', 'camarones', 'noisette'],
  },
  {
    id: 'trucha-patagonica',
    name: 'Trucha Patagónica al Limón y Alcaparras',
    category: 'Pescados Australes',
    description:
      'Filete entero despinado a la manteca de limón, alcaparras y puré cremoso de papas.',
    price: 38900,
    tags: ['trucha', 'patagonica', 'limon', 'alcaparras', 'pescado'],
  },
  {
    id: 'abadejo-canal-beagle',
    name: 'Abadejo del Canal Beagle en Salsa de Mariscos',
    category: 'Pescados Australes',
    description:
      'Posta de abadejo fresco con reducción suave de tomate, mejillones, almejas y papas al natural.',
    price: 41200,
    tags: ['abadejo', 'canal beagle', 'pescado', 'mejillones'],
  },
  {
    id: 'salmon-rosado-grillado',
    name: 'Salmón Rosado Grillado con Vegetales',
    category: 'Pescados Australes',
    description:
      'Lomo de salmón rosado a punto jugoso con mix de verduras salteadas al oliva y arroz pilaf.',
    price: 44800,
    tags: ['salmon', 'grillado', 'vegetales', 'pescado'],
  },

  // Paellas y Cazuelas
  {
    id: 'paella-mariscos',
    name: 'Paella de Mariscos del Fin del Mundo (Para 2)',
    category: 'Paellas y Cazuelas',
    description:
      'Arroz bomba al azafrán con centolla, langostinos, calamares, mejillones, vieyras y pimientos asados.',
    price: 64900,
    highlight: 'Para Compartir',
    tags: ['paella', 'arroz', 'azafran', 'mariscos', 'centolla', 'compartir'],
  },
  {
    id: 'cazuela-pulpo-langostinos',
    name: 'Cazuela de Pulpo Español y Langostinos',
    category: 'Paellas y Cazuelas',
    description:
      'Tentáculos de pulpo braseados con pimentón de la Vera, langostinos y papas confitadas en aceite de oliva.',
    price: 55800,
    tags: ['pulpo', 'langostinos', 'cazuela', 'pimenton'],
  },
  {
    id: 'arroz-caldoso-beagle',
    name: 'Arroz Caldoso de Frutos de Mar',
    category: 'Paellas y Cazuelas',
    description:
      'Cocción tradicional en caldo de centolla con vieyras, calamaretes y perejil fresco.',
    price: 46500,
    tags: ['arroz', 'caldoso', 'frutos de mar', 'cazuela'],
  },

  // Pastas Caseras
  {
    id: 'tarantela-fueguina',
    name: 'Pastas Tarantela Fueguina',
    category: 'Pastas Caseras',
    description:
      'Nuestro clásico insignia: pasta artesanal salteada con centolla, camarones al ajillo, mejillones al perejil y papas noisette.',
    price: 59900,
    highlight: 'Clásico Histórico',
    tags: ['tarantela', 'centolla', 'camarones', 'mejillones', 'pasta'],
  },
  {
    id: 'sorrentinos-centolla',
    name: 'Sorrentinos Caseros de Centolla',
    category: 'Pastas Caseras',
    description:
      'Amasados a mano y rellenos de centolla fueguina y mozzarella con salsa rosa suave de mariscos.',
    price: 46900,
    tags: ['sorrentinos', 'centolla', 'pasta', 'rellena'],
  },
  {
    id: 'ravioles-merluza-negra',
    name: 'Ravioles de Merluza Negra y Ricota',
    category: 'Pastas Caseras',
    description:
      'Pasta fresca al huevo rellena de merluza negra confitada, servida con manteca de salvia y ralladura cítrica.',
    price: 44200,
    tags: ['ravioles', 'merluza negra', 'pasta', 'casera'],
  },
  {
    id: 'tallarines-abuela-eva',
    name: 'Tallarines de la Abuela Eva',
    category: 'Pastas Caseras',
    description:
      'Cintas caseras al huevo con salsa fileto tradicional, bolognesa o cuatro quesos de la casa.',
    price: 32900,
    tags: ['tallarines', 'abuela eva', 'pasta', 'clasica'],
  },

  // Carnes y Minutas
  {
    id: 'bife-chorizo-patagonico',
    name: 'Bife de Chorizo Patagónico a la Parrilla',
    category: 'Carnes y Minutas',
    description:
      'Corte seleccionado de 380g con papas fritas bastón o ensalada mixta de estación.',
    price: 39500,
    tags: ['bife', 'carne', 'parrilla', 'papas'],
  },
  {
    id: 'milanesa-casera',
    name: 'Milanesa de Ternera Casera con Guarnición',
    category: 'Carnes y Minutas',
    description:
      'Clásica milanesa de nalga empanada a mano, opción simple o napolitana, con papas fritas o puré.',
    price: 31800,
    tags: ['milanesa', 'carne', 'minuta', 'papas', 'napolitana'],
  },
  {
    id: 'pollo-grillado-hierbas',
    name: 'Pechuga Grillada a las Finas Hierbas',
    category: 'Carnes y Minutas',
    description:
      'Pechuga de pollo sellada al limón y romero con vegetales asados y puré de calabaza.',
    price: 30500,
    tags: ['pollo', 'grillado', 'minuta', 'sin tacc'],
  },

  // Postres Regionales
  {
    id: 'copa-calafate',
    name: 'Copa Helada de Calafate Artesanal',
    category: 'Postres Regionales',
    description:
      'Helado crema con reducción tibia de frutos de calafate patagónico y crocante de almendras.',
    price: 14500,
    highlight: 'Leyenda del Sur',
    tags: ['calafate', 'helado', 'postre', 'patagonia'],
  },
  {
    id: 'flan-casero-mixto',
    name: 'Flan Casero con Dulce de Leche y Crema',
    category: 'Postres Regionales',
    description:
      'Receta tradicional al horno con caramelo artesanal, dulce de leche argentino y crema chantilly.',
    price: 12200,
    tags: ['flan', 'dulce de leche', 'postre', 'casero'],
  },
  {
    id: 'mousse-chocolate-amargo',
    name: 'Mousse de Chocolate Patagónico y Frutos Rojos',
    category: 'Postres Regionales',
    description:
      'Cremoso chocolate semiamargo al 70% con coulis de frambuesas y moras fueguinas.',
    price: 13800,
    tags: ['chocolate', 'mousse', 'frutos rojos', 'postre'],
  },

  // Bebidas y Bodega
  {
    id: 'vino-pinot-noir-patagonia',
    name: 'Pinot Noir Bodega Austral (750 ml)',
    category: 'Bebidas y Bodega',
    description:
      'Tinto patagónico de cuerpo elegante y notas a frutos rojos, ideal para maridar con centolla y merluza negra.',
    price: 34500,
    highlight: 'Maridaje Recomendado',
    tags: ['vino', 'pinot noir', 'bodega', 'patagonia', 'bebida'],
  },
  {
    id: 'vino-chardonnay-rio-negro',
    name: 'Chardonnay Valle de Río Negro (750 ml)',
    category: 'Bebidas y Bodega',
    description:
      'Blanco fresco de acidez equilibrada, aromas cítricos y paso sutil por roble francés.',
    price: 31900,
    tags: ['vino', 'chardonnay', 'blanco', 'bodega', 'bebida'],
  },
  {
    id: 'cerveza-artesanal-fueguina',
    name: 'Cerveza Artesanal Fueguina (Pinta 500 ml)',
    category: 'Bebidas y Bodega',
    description:
      'Rubia Golden Ale, Roja Scottish o Negra Stout elaboradas con agua de deshielo de Ushuaia.',
    price: 9800,
    tags: ['cerveza', 'artesanal', 'ushuaia', 'pinta', 'bebida'],
  },
  {
    id: 'agua-gaseosa',
    name: 'Agua Mineral / Gaseosa Línea Clásica',
    category: 'Bebidas y Bodega',
    description: 'Agua con o sin gas, gaseosas o limonada fresca con menta y jengibre.',
    price: 5500,
    tags: ['agua', 'gaseosa', 'limonada', 'sin alcohol', 'bebida'],
  },
];

export const INITIAL_GALLERY_FRAMES: GalleryFrame[] = [
  {
    id: 'gal-fachada',
    title: 'Fachada Histórica en Av. San Martín 232',
    caption: 'La icónica casona rosada de Ushuaia',
    detail:
      'Nuestra tradicional casona patagónica sobre la avenida principal recibe viajeros y locales desde 1994.',
    src: RESTAURANT_INFO.mainPhoto,
    objectPosition: 'center center',
    scaleClass: 'scale-100',
  },
  {
    id: 'gal-centolla',
    title: 'Centolla Fueguina Entera',
    caption: 'Selección de acuario propio con salsas de la casa',
    detail:
      'Centolla entera del Canal Beagle servida con limón fresco, manteca clarificada y salsa golf artesanal.',
    src: '/src/assets/images/gal_natural_centolla_1795358641324.jpg',
    objectPosition: 'center center',
    scaleClass: 'scale-100',
  },
  {
    id: 'gal-salon',
    title: 'Salón Tradicional en Ushuaia',
    caption: 'Madera patagónica, ventanales azules y mesas clásicas',
    detail:
      'Ambiente cálido e histórico de más de tres décadas en el centro de Ushuaia.',
    src: '/src/assets/images/gal_natural_salon_1795358641924.jpg',
    objectPosition: 'center center',
    scaleClass: 'scale-100',
  },
  {
    id: 'gal-cazuela',
    title: 'Cazuela de Mariscos y Centolla',
    caption: 'Servida en barro humeante con frutos del Canal Beagle',
    detail:
      'Cazuela abundante con centolla, langostinos, mejillones y papas al natural.',
    src: '/src/assets/images/gal_natural_cazuela_1795358641586.jpg',
    objectPosition: 'center center',
    scaleClass: 'scale-100',
  },
  {
    id: 'gal-merluza',
    title: 'Merluza Negra Austral',
    caption: 'Con crema de puerros y papas doradas',
    detail:
      'Uno de los pescados más preciados del Atlántico Sur, preparado al punto justo.',
    src: '/src/assets/images/gal_natural_merluza_1795358642467.jpg',
    objectPosition: 'center center',
    scaleClass: 'scale-100',
  },
];

export const NEARBY_LANDMARKS = [
  { name: 'Canal Beagle & Costanera', distance: '250 m · 3 min a pie' },
  { name: 'Puerto Turístico de Ushuaia', distance: '350 m · 4 min a pie' },
  { name: 'Museo del Fin del Mundo', distance: '450 m · 5 min a pie' },
  { name: 'Cartel Letrero Ushuaia', distance: '600 m · 7 min a pie' },
];
