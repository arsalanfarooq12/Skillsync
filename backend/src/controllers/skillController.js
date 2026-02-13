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

// gets all the skills at one place
export const getAllSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(skills);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching skills", detail: error.message });
  }
};

export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  try {
    const skill = await prisma.skill.findUnique({
      where: { id: id },
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this skill" });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id: id },
      data: {
        title: title || skill.title,
        description: description || skill.description,
        category: category || skill.category,
      },
    });

    res.status(200).json(updatedSkill);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating skill", detail: error.message });
  }
};

// user can delete a skill which he owns

export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await prisma.skill.findUnique({
      where: { id: id },
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this skill" });
    }

    await prisma.skill.delete({
      where: { id: id },
    });

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res
      .status(500)
      .json({ message: "Error deleting skill", detail: error.message });
  }
};
