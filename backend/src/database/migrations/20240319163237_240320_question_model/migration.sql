-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "imgUrl" TEXT,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "answer" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
