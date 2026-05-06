const RULES = [
  {
    category: 'Food',
    keywords: [
      'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'meal', 'lunch', 'dinner', 'breakfast', 'snack', 'brunch', 'tiffin',
      'swiggy', 'zomato', 'starbucks', 'mcdonald', 'kfc', 'dominos', 'subway', 'ccd', 'haldiram', 'wow momo',
      'groceries', 'grocery', 'supermarket', 'bigbasket', 'blinkit', 'instamart', 'zepto', 'dunzo', 'jiomart',
      'maggi', 'noodles', 'pasta', 'sandwich',
      'biryani', 'biriyani', 'dosa', 'idli', 'vada', 'samosa', 'paratha', 'roti', 'chapati', 'thali', 'paneer', 'sabzi', 'pulao',
      'chole', 'bhature', 'rajma', 'momos', 'pakora', 'tikka', 'kebab', 'chaat',
      'pav bhaji', 'vada pav', 'masala dosa',
      'chai', 'juice', 'lassi', 'smoothie', 'milkshake',
      'sweets', 'mithai', 'cake', 'ice cream', 'icecream', 'dessert', 'chocolate', 'bakery', 'jalebi', 'kulfi', 'gulab jamun',
      'fruit', 'fruits', 'vegetable', 'vegetables', 'veggies', 'milk', 'bread', 'eggs'
    ]
  },
  {
    category: 'Bills',
    keywords: [
      'electricity', 'water bill', 'internet', 'wifi', 'broadband',
      'phone bill', 'mobile bill', 'recharge', 'postpaid', 'prepaid',
      'jio', 'airtel', 'vodafone', 'vi', 'bsnl',
      'rent', 'mortgage', 'lease', 'maintenance',
      'insurance',
      'lpg', 'cylinder', 'dth', 'tata sky',
      'bill'
    ]
  },
  {
    category: 'Entertainment',
    keywords: [
      'movie', 'cinema', 'theatre', 'theater', 'multiplex', 'pvr', 'inox',
      'netflix', 'prime video', 'hotstar', 'jiocinema', 'sonyliv', 'zee5', 'voot',
      'spotify', 'youtube', 'gaana', 'wynk',
      'concert', 'event', 'show', 'gig',
      'game', 'gaming', 'steam', 'playstation', 'xbox',
      'bookmyshow', 'paytm insider'
    ]
  },
  {
    category: 'Transport',
    keywords: [
      'uber', 'ola', 'rapido', 'blusmart', 'meru', 'namma yatri',
      'taxi', 'cab', 'auto', 'autorickshaw', 'rickshaw',
      'bus', 'train', 'metro', 'local',
      'fuel', 'petrol', 'diesel', 'gas',
      'parking', 'toll', 'fastag',
      'flight', 'airline', 'airport', 'indigo', 'spicejet', 'vistara', 'irctc',
      'commute', 'ride', 'trip', 'travel',
      'scooty', 'scooter', 'bike'
    ]
  },
  {
    category: 'Shopping',
    keywords: [
      'amazon', 'flipkart', 'myntra', 'meesho', 'ajio', 'nykaa', 'snapdeal', 'tata cliq', 'tatacliq', 'shein',
      'mall', 'store', 'shop', 'market',
      'clothes', 'clothing', 'shirt', 'tshirt', 't-shirt', 'jeans', 'dress', 'shoes', 'sneakers', 'sandals',
      'kurta', 'saree', 'lehenga', 'salwar',
      'bag', 'wallet', 'watch', 'jewelry', 'jewellery',
      'electronics', 'gadget', 'headphones', 'earphones', 'charger'
    ]
  },
  {
    category: 'Health',
    keywords: [
      'doctor', 'dentist', 'physician', 'consultation',
      'medicine', 'medicines', 'pharmacy', 'medical', 'tablet', 'tablets', 'syrup',
      'hospital', 'clinic', 'checkup', 'lab', 'diagnostic',
      'gym', 'yoga', 'fitness', 'workout', 'cult',
      'apollo', 'pharmeasy', '1mg', 'netmeds', 'tata 1mg', 'practo'
    ]
  },
  {
    category: 'Education',
    keywords: [
      'book', 'books', 'course', 'tuition', 'school', 'college', 'university',
      'udemy', 'coursera', 'edx', 'byju', 'byjus', 'unacademy', 'vedantu', 'upgrad', 'simplilearn',
      'tutor', 'fees', 'exam', 'certification',
      'stationery', 'notebook', 'pen', 'pencil'
    ]
  }
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const COMPILED = RULES.map(({ category, keywords }) => {
  const sorted = [...keywords].sort((a, b) => b.length - a.length).map(escapeRegex);
  return {
    category,
    pattern: new RegExp(`\\b(?:${sorted.join('|')})\\b`, 'i')
  };
});

export function categorize(description = '') {
  for (const { category, pattern } of COMPILED) {
    if (pattern.test(description)) return category;
  }
  return 'Other';
}

export const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];
