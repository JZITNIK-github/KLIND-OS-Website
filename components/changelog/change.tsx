"use client";

import { useState, useEffect } from "react";
import { backendUrl } from "@/config";
import Loader from "../common/Loader";
import { useSearchParams } from "next/navigation";

export default function blogposts() {
  const [content, setContent] = useState(<Loader></Loader>);
  const [nadpis, setTitle] = useState("Načítání");
  const pathname = useSearchParams();

  useEffect(() => {
    const branchName = pathname.get("branch");
    const id = pathname.get("id");
    fetch(backendUrl + "/changelog/get?id=" + id + "&branch=" + branchName)
      .then((res) => res.json())
      .then((response) => {
        if (!response) {
          setTitle("Nenalezeno!");
          setContent(
            <div className="max-w-3xl mx-auto pb-12 md:pb-16">
              <h1 className="h1 mb-4 text-center" data-aos="fade-up">
                Branch nenalezen!
              </h1>
              <p
                className="text-xl text-gray-400 mb-8 text-center"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Branch nebyl nalezen!
              </p>
            </div>,
          );
          return;
        }
        setContent(
          <div className="max-w-3xl mx-auto pb-12 md:pb-16">
            <h1 className="h1 mb-4 text-center" data-aos="fade-up">
              {response.title}
            </h1>
            <p
              className="text-xl text-gray-400 mb-8 text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Datum: {response.date}
            </p>
            <div
              className="text-gray-400 mb-8 leading-8"
              data-aos="fade-up"
              data-aos-delay="400"
              dangerouslySetInnerHTML={{ __html: response.content }}
            ></div>
            <h3 className="h3 mb-4" data-aos="fade-up" data-aos-delay="600">
              Změny
            </h3>
            <ul>
              {response.commits.map((commit: string) => {
                return (
                  <li
                    className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    data-aos="fade-up"
                    data-aos-delay="800"
                    style={{ width: "fit-content" }}
                  >
                    <a target="_blank" href={commit}>
                      {commit.split("/commit/")[1]}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>,
        );
        setTitle(response.title);
      })
      .catch((e) => {
        console.log(e);
        setContent(<h1>Příspěvek nenalezen!</h1>);
        setTitle("Chyba!");
      });
  }, []);
  useEffect(() => {
    const elements = document.querySelectorAll(".content *");
    Array.from(elements).forEach((element) => {
      element.classList.add(element.tagName.toLowerCase());
    });
    const a = document.querySelectorAll(".content a");
    Array.from(a).forEach((element) => {
      element.setAttribute("target", "_blank");
    });
  }, [content]);
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <title>{nadpis + " - KLIND OS"}</title>
        <div className="relative pt-32 md:pt-40 content">{content}</div>
      </div>
    </section>
  );
}
