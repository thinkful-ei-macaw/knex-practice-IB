const knex = require("knex");
require("dotenv").config();

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

// SELECT product_id, name, price, category
//   FROM amazong_products
// WHERE name = 'Point of view gun';

function searchByProduceName(searchTerm) {
  knexInstance
    .select("product_id", "name", "price", "category")
    .from("amazong_products")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}
// searchByProduceName("holo");

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select("product_id", "name", "price", "category")
    .from("amazong_products")
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

// paginateProducts(2);

function getProductsWithImages() {
  knexInstance
    .select("product_id", "name", "price", "category", "image")
    .from("amazong_products")
    .whereNotNull("image")
    .then(result => {
      console.log(result);
    });
}

// getProductsWithImages();

function mostPopularVideosForDays(days) {
  knexInstance
    .select("video_name", "region")
    .count("date_viewed AS views")
    .where(
      "date_viewed",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from("whopipe_video_views")
    .groupBy("video_name", "region")
    .orderBy([
      { column: "region", order: "ASC" },
      { column: "views", order: "DESC" }
    ])
    .then(result => {
      console.log(result);
    });
}

mostPopularVideosForDays(30);

// const qry = knexInstance
//   .select("product_id", "name", "price", "category")
//   .from("amazong_products")
//   .where({ name: "Point of view gun" })
//   .first()
//   .toQuery();

// console.log(qry);

knexInstance("amazong_products").select("*");
console.log("knex and driver installed correctly");
