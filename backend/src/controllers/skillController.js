import prisma from "../lib/prisma.js";
export const createSkill = async (req, res) => {
  const { title, description, category } = req.body;

  try {
    const newSkill = await prisma.skill.create({
      data: {
        title,
        description,
        category,
        userId: req.user.id,
      },
    });
    res.status(201).json(newSkill);
  } catch (error) {
    console.error("DETAILED ERROR:", error);
    res
      .status(500)
      .json({ message: "Error creating skill", detail: error.message });
  }
};
