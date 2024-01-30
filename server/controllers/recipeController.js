require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, thai, american, chinese };

    res.render('index', { title: 'Cooking Blog - Home', categories, food } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}




// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


//  async function insertDymmyRecipeData(){
//    try {
//      await Recipe.insertMany([
//        { 
//          "name": "Roasted Fennel-and-Beet Salad",
//          "description": `Preheat oven to 400°F. Toss together fennel, beets, and 2 tablespoons oil on a rimmed baking sheet. Season with salt and pepper. Roast until tender, 35 to 40 minutes. Cool completely. Whisk together vinegar, honey, zest, vanilla (if desired), and remaining 1/4 cup oil in a bowl. Season with salt and pepper. Toss together arugula and 1/4 cup dressing in a bowl. Top with roasted vegetables, clementines, Parmesan, and almonds. Drizzle with remaining dressing. Serve immediately.`,
//          "email": "recipeemail@yajush.co.in",
//          "ingredients": [
//            "1 fennel bulb, stalks and core discarded and chopped into 1-inch pieces",
//            "3 beets (about half pound), cut into 1-inch pieces",
//            "1 by 4 c. plus 2 tablespoons olive oil, divided",
//            "Kosher salt and freshly ground black pepper",
//            "2 tbsp. plus 2 teaspoons white wine vinegar",
//            "1 tsp. pure honey",
//            "Half tsp. clementine zest",
//            "1 and a half tsp. pure vanilla extract, optional",
//            "5 oz. baby arugula",
//            "2 clementines, peeled and separated into segments",
//            "1 and a half oz. Parmesan, shaved",
//            "Half c. roasted almonds"
//          ],
//          "category": "American", 
//          "image": "roasted-fennel-and-beet-salad-with-clementines.jpg"
//        },
//        { 
//         "name": "Paneer tikka",
//         "description": `Cut paneer into small pieces. Mix the curd along with salt, ginger garlic paste, tandoori masala, red chilli powder, turmeric, corn flour, and vegetables. Keep it aside for marination for about 30 minutes.
//         Apply oil to the paneer and vegetable pieces. Place them in the baking tray. Bake 180 degree Centigrade for 20 minute. Serve hot.`,
//         "email": "recipeemail@yajush.co.in",
//         "ingredients": [
//           "250 g Paneer(cut in big cubes)",
//           "1 Capsicum",
//           "1 Tomato",
//           "2 Onions",
//           "1 tbsp curd",
//           "Half tbsp of Ginger garlic paste",
//           "1 tbsp of Tandoori masala",
//           "5 and half tsp of Turmeric powder",
//           "Half tsp of red chilli powder",
//           "1 tsp of cornflour",
//           "1 tbsp of oil",
//           "Salt"
//         ],
//         "category": "Indian", 
//         "image": "paneer-tikka.jpg"
//       },
//       { 
//         "name": "Honey Chilli Cauliflower",
//         "description": `Cut the cauliflower florets into neat pieces. Wash them properly, pat dry and set aside. Now add all-purpose flour to a bowl. Now add some salt, red chilli powder and give a mix. Now add water as per need and mix well to prepare a slurry. The consistency should neither be too thick nor too thin. Now heat oil in a kadhai. Dip the florets in the slurry and deep fry them in batches. Fry until golden brown in colour. Take out on an absorbent paper and set aside.Now heat 2 tbsp oil in a pan. Add chopped garlic, onion and dry red chillies. Fry for 3-4 minutes. Now add soy sauce, ketchup, honey and salt as per taste. Mix well and cook for about two minutes. Now add the florets and mix well to coat them in the honey mixture. Lastly, add sesame seeds and cook for about two minutes more. Lip-smacking Honey Chilli Cauliflower is now ready to be served.`,
//         "email": "recipeemail@yajush.co.in",
//         "ingredients": [
//           "1 cauliflower",
//           "2 tablespoon honey",
//           "1 tablespoon soy sauce",
//           "2 dry red chilli",
//           "1 small onion",
//           "1 tablespoon sesame seeds",
//           "1 by 4 cup of all purpose flour",
//           "1 teaspoon red chilli powder",
//           "1 tablespoon tomato ketchup",
//           "5 cloves garlic",
//           "Salt",
//           "1 cup vegetable oil"
//         ],
//         "category": "Chinese", 
//         "image": "honeychillicauliflower.jpg"
//       },
//       { 
//         "name": "Thai Cashew Tofu Stir-Fry",
//         "description": `If you're using unroasted cashews, you can quickly toast them in a dry skillet over medium heat until they're lightly brown. Toss them around every now and then so they'll get roasted evenly without burning.
//         Then, set them aside to cool down and crunch up. Now, let's prepare the tofu for the stir-fry. Make sure you're using firm tofu, not silken tofu. If you can, get the medium-firm tofu block as it's a little spongier and will work better for this recipe.
//         Rinse and drain the tofu block, then dice it into bite-sized cubes. Add them to a bowl, followed by 2 tbsp of soy sauce and 40 mL of water. Mix well to coat the tofu cubes with the soy marinade, and let them soak for 15 minutes.
//         Meanwhile, prepare the cashew stir-fry sauce. The sauce is usually made with Thai chilli paste, which contains shrimp paste. But you should be able to find the vegan Thai chilli paste made with shitake mushrooms (sometimes called vegetarian Thai chilli paste) 
//         at the supermarket or Asian food stores. o make the stir-fry sauce, mix the sesame oil with the Thai chilli paste and the remaining 2 tbsp of soy sauce and 50 mL of water in a cup. Now, let's make the tofu stir-fry. Use a wok if you have it for the best results. 
//         But a cast iron pan, non-stick skillet, or stainless steel pan will also work. Heat the vegetable oil over medium heat. Then add thinly sliced garlic and Thai red chillies, cut in half lengthwise, and sizzle them for a minute until fragrant. Thai chillies are quite spicy, 
//         so you can leave them whole if you prefer a milder stir-fry. If you can't find fresh red chillies, you can also use the dried ones. Next, add the marinated tofu cubes, leaving the excess soy sauce behind in the bowl. Cook them over medium-high heat until the liquids have 
//         evaporated. Then, sear the tofu cubes until they're lightly browned, tossing them around the pan to char them nicely on all sides. Now, turn the heat to high and tip in the prepared Thai chilli sauce, followed by diced red peppers and wedged onions. Stir-fry all until the 
//         onions have softened slightly. You want the veggies to be a little tender but still somewhat crunchy. Finally, add chopped spring onions and roasted cashews. Give all a final stir and remove the pan from the heat. Serve your delicious vegan Thai cashew "chicken" right away
//         with a side of steamed jasmine rice, lime wedges, and stir-fried greens like this Thai morning glory.`,
//         "email": "recipeemail@yajush.co.in",
//         "ingredients": [
//           "400 g Tofu Block",
//           "4 tbsp Soy Sauce",
//           "1 tablespoon soy sauce",
//           "90 ml Water",
//           "1 small onion",
//           "Half tablespoon Sesame Oil",
//           "2 tbsp Vegan Thai Chilli Paste",
//           "Half tablespoon Vegetable Oil",
//           "4 small garlic clove",
//           "4 Fresh Thai red chillies",
//           "2 Red Pepper",
//           "1 Large Onion",
//           "4 Spring Onion Stalks",
//           "80 g Roasted Cashew Nuts"
//         ],
//         "category": "Thai", 
//         "image": "tofu-cashew-stir-fry-in-a-pan.webp"
//       },
//       { 
//         "name": "Tofu and Broccoli Stir-Fry",
//         "description": `Boil water in a skillet and add the broccoli. Cook the broccoli until it’s done, then remove it. Crisp the marinated tofu. Add the ginger and garlic. Thicken the sauce. Stir in the broccoli and mix. Enjoy!`,
//         "email": "recipeemail@yajush.co.in",
//         "ingredients": [
//           "Broccoli",
//           "1 Block Tofu",
//           "Ginger and garlic",
//           "Mixed Sauce"
//         ],
//         "category": "Thai", 
//         "image": "tofu-cashew-stir-fry-in-a-pan.webp"
//       },
//      ]);
//    } catch (error) {
//      console.log('err', + error)
//    }
//  }

//  insertDymmyRecipeData();