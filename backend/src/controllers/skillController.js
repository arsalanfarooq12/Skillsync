import prisma from "../lib/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createSkill = catchAsync(async (req, res, next) => {
  const { title, description, category } = req.body;

  const newSkill = await prisma.skill.create({
    data: {
      title,
      description,
      category,
      userId: req.user.id,
    },
  });
  res.status(201).json(newSkill);
});

export const getAllSkills = catchAsync(async (req, res, next) => {
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
});

export const updateSkill = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  const skill = await prisma.skill.findUnique({
    where: { id: id },
  });

  if (!skill) {
    return next(new AppError("Skill not found", 404));
  }

  if (skill.userId !== req.user.id) {
    return next(new AppError("Not authorized to update this skill", 403));
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
});

export const deleteSkill = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const skill = await prisma.skill.findUnique({
    where: { id: id },
  });

  if (!skill) {
    return next(new AppError("Skill not found", 404));
  }

  if (skill.userId !== req.user.id) {
    return next(
      new AppError("You are not authorized to delete this skill", 403)
    );
  }

  await prisma.skill.delete({
    where: { id: id },
  });

  res.status(200).json({ message: "Skill deleted successfully" });
});
