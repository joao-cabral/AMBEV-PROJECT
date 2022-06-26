-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beers" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "nationality" TEXT,
    "description" TEXT,
    "id_brand" TEXT NOT NULL,
    "id_type" TEXT NOT NULL,

    CONSTRAINT "beers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beer_characteristics" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "percent_alcohol" DECIMAL(65,30) NOT NULL,
    "ideal_temperature" DECIMAL(65,30) NOT NULL,
    "ibu" DECIMAL(65,30) NOT NULL,
    "ingredients" TEXT NOT NULL,
    "allergic_ingredients" TEXT NOT NULL,
    "nutricional_information" TEXT NOT NULL,
    "calories" TEXT NOT NULL,
    "carbohydrates" TEXT NOT NULL,
    "color" TEXT,
    "id_beer" TEXT NOT NULL,

    CONSTRAINT "beer_characteristics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beer_types" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "beer_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "beers_name_key" ON "beers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "beer_types_name_key" ON "beer_types"("name");

-- AddForeignKey
ALTER TABLE "beers" ADD CONSTRAINT "beers_id_brand_fkey" FOREIGN KEY ("id_brand") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beers" ADD CONSTRAINT "beers_id_type_fkey" FOREIGN KEY ("id_type") REFERENCES "beer_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beer_characteristics" ADD CONSTRAINT "beer_characteristics_id_beer_fkey" FOREIGN KEY ("id_beer") REFERENCES "beers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
