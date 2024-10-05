"use client";
import { useState } from "react";
import { IoArrowUndoSharp } from "react-icons/io5";
import Image from "next/image";
import CounterQuantity from "./components/CounterQuantity";
import { useForm, SubmitHandler } from "react-hook-form";
import { Profil } from "./modules/modules";
import { motion } from "framer-motion";
import moment from "moment";
import { useTemplate, usePostTemplate } from "../hooks/useTemplate";

const ProfileImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    className="object-cover w-10 h-10 rounded-full"
    src={src || "/default-image.png"}
    alt={alt}
    width={40}
    height={40}
    priority
  />
);

const ReplyButton = ({
  onClick,
  pseudo,
}: {
  onClick: () => void;
  pseudo: string;
}) => (
  <button
    className="flex items-center cursor-pointer"
    onClick={onClick}
    aria-label={`Répondre à ${pseudo}`}
  >
    <IoArrowUndoSharp className="text-purple-700 font-bold" />
    <span className="ml-1 text-sm md:text-md font-bold text-purple-700">
      Reply
    </span>
  </button>
);

const CommentContent = ({ comment }: { comment: string }) => {
  const formatCommentWithMentions = (comment: string) => {
    const mentionRegex = /(@\w+)/g;
    return comment.split(mentionRegex).map((part, index) =>
      mentionRegex.test(part) ? (
        <span key={index} className="text-purple-700 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <p className="text-gray-500 mt-2">{formatCommentWithMentions(comment)}</p>
  );
};

export default function Page() {
  const { data: getComments } = useTemplate();
  const { mutate: postComment } = usePostTemplate();
  const [respondIndex, setRespondIndex] = useState<number | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{ comment: string }>();

  const onSubmit: SubmitHandler<{ comment: string }> = (formData) => {
    console.log(replyingTo);

    const newReply = {
      id: Math.random() * 1000,
      parentId: parentId,
      img: "/assets/avatars/image-juliusomo.png",
      pseudo: "juliusomo",
      date: moment().fromNow(),
      quantity: 0,
      comment: formData.comment,
    };

    postComment(newReply, {
      onSuccess: () => {
        setRespondIndex(null);
        setParentId(null);
        setReplyingTo("");
        setValue("comment", "");
      },
    });
  };

  const handleReplyClick = (
    index: number,
    commentId: number,
    pseudo: string
  ) => {
    setRespondIndex(index);
    setParentId(commentId);
    setReplyingTo(pseudo);
    setValue("comment", `@${pseudo} `);
  };

  return (
    <main
      className="flex items-center justify-center h-auto my-12 comment-list px-4 md:px-0"
      role="main"
    >
      <ul className="w-full max-w-3xl">
        {getComments?.map((item: Profil, index: number) => (
          <li key={item.id} className="mb-4 " role="article">
            <motion.section
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`flex md:flex-row mt-5 items-start bg-white text-black rounded-xl shadow-lg p-4 ${
                respondIndex === index ? "border-l-4 border-purple-700" : ""
              }`}
              aria-expanded={respondIndex === index}
            >
              <CounterQuantity quantityUser={item.quantity} />
              <div className="flex-grow ">
                <div className="flex items-center justify-between">
                  <ProfileImage
                    src={item.img || "/assets/avatars/image-amyrobson.webp"}
                    alt={`Photo de profil de ${item.pseudo}`}
                  />
                  <div className="flex flex-grow justify-between items-start">
                    <div className="flex flex-col md:flex-row">
                      <p className="flex-grow font-bold ml-2">
                        {item.pseudo}
                        {item.pseudo === "juliusomo" && (
                          <span className="bg-purple-700 py-1 px-2 text-white text-xs font-bold">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="ml-2 text-gray-500">{item.date}</p>
                    </div>
                    <ReplyButton
                      onClick={() =>
                        handleReplyClick(index, item.id, item.pseudo)
                      }
                      pseudo={item.pseudo}
                    />
                  </div>
                </div>
                <CommentContent comment={item.comment} />
              </div>
            </motion.section>

            {item.reply && item.reply.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="md:mt-2 md:ml-14 mt-2 ml-4 pl-4 border-l-2 border-gray-300"
              >
                {item.reply.map((reply) => (
                  <li
                    key={reply.id}
                    className="flex md:flex-row mt-5 items-start bg-white text-black rounded-xl shadow-lg p-4"
                  >
                    <CounterQuantity quantityUser={reply.quantity} />
                    <div className="flex-grow">
                      <div className="flex justify-between w-full">
                        <ProfileImage
                          src={reply.img}
                          alt={`Photo de profil de ${reply.pseudo}`}
                        />
                        <div className="flex flex-grow justify-between items-center">
                          <div className="flex flex-col md:flex-row">
                            <p className="flex-grow font-bold ml-2">
                              {reply.pseudo}
                              {reply.pseudo === "juliusomo" && (
                                <span className="ml-2 bg-purple-700 py-1 px-2 text-white text-xs font-bold">
                                  YOU
                                </span>
                              )}
                            </p>
                            <p className="ml-2 text-gray-500">{reply.date}</p>
                          </div>
                        </div>
                        <ReplyButton
                          onClick={() =>
                            handleReplyClick(index, item.id, reply.pseudo)
                          }
                          pseudo={reply.pseudo}
                        />
                      </div>
                      <CommentContent comment={reply.comment} />
                    </div>
                  </li>
                ))}
              </motion.ul>
            )}

            {respondIndex === index && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col md:flex-row items-start w-full bg-white text-black rounded-xl shadow-lg p-4 mt-4"
                aria-label="Formulaire de réponse"
              >
                <ProfileImage
                  src="/assets/avatars/image-juliusomo.png"
                  alt="Image de profil"
                />
                <textarea
                  {...register("comment", { required: true })}
                  placeholder="Add a comment..."
                  className="w-full border h-32 md:h-20 mx-4 rounded-lg p-2"
                  value={watch("comment")}
                  onChange={(e) => setValue("comment", e.target.value)}
                  aria-label="Votre commentaire"
                />
                {errors.comment && (
                  <span className="text-red-500">{errors.comment.message}</span>
                )}
                <button
                  type="submit"
                  className="text-white bg-purple-700 rounded-lg px-8 py-2 mt-2 md:mt-0"
                >
                  Send
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
