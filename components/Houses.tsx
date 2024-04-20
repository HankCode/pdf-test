"use client";

import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { dummyData } from "@/lib/dummyData";
import { House } from "@/lib/dummyData";

const Houses = () => {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  const handleGeneratePDF = async () => {
    if (!selectedHouse) return;

    const pdfDoc = await PDFDocument.create();
    let pageIndex = 0;
    let page = pdfDoc.addPage([600, 800]);

    // Set font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    page.setFont(font);

    // Draw main heading
    page.drawText("Sprent AB", {
      x: 50,
      y: 750,
      size: 25,
      color: rgb(0, 0, 0),
    });

    // Draw secondary heading
    page.drawText(`PFG for housing: ${selectedHouse.id}`, {
      x: 50,
      y: 720,
      size: 20,
      color: rgb(0, 0, 0),
    });

    // Draw text
    page.drawText(`Contact Person: ${selectedHouse.contactPerson}`, {
      x: 50,
      y: 680,
      size: 15,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Size: ${selectedHouse.size}`, {
      x: 50,
      y: 650,
      size: 15,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Rooms: ${selectedHouse.rooms}`, {
      x: 50,
      y: 620,
      size: 15,
      color: rgb(0, 0, 0),
    });

    // Load and embed images
    let x = 50;
    let y = 520;
    let imagesPerRow = 0;
    const imageWidth = 150; // Adjust image width
    const imageHeight = 100; // Adjust image height
    const spacing = 20; // Adjust spacing between images
    for (let i = 0; i < selectedHouse.images.length; i++) {
      const imageUrl = selectedHouse.images[i];
      const imageBase64 = await loadImageAsBase64(imageUrl);
      const imageBytes = Uint8Array.from(atob(imageBase64), (c) => c.charCodeAt(0));
      const image = await pdfDoc.embedPng(imageBytes);

      if (imagesPerRow >= 3) {
        pageIndex++;
        page = pdfDoc.addPage([600, 800]);
        x = 50;
        y = 750; // Reset y position to top of the page
        imagesPerRow = 0;
      }

      page.drawImage(image, {
        x,
        y,
        width: imageWidth,
        height: imageHeight,
      });

      imagesPerRow++;
      x += imageWidth + spacing;
    }

    const pdfBytes = await pdfDoc.save();

    // Download the PDF
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${selectedHouse.contactPerson}_house.pdf`;
    link.click();
  };

  const loadImageAsBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        if (!blob) {
          reject(new Error("Failed to load image blob"));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to create canvas context"));
              return;
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error("Failed to convert image to blob"));
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result as string;
                resolve(base64.split(",")[1]);
              };
              reader.onerror = (error) => reject(error);
              reader.readAsDataURL(blob);
            }, "image/png");
          };
          img.onerror = (error) => reject(error);
          img.src = URL.createObjectURL(blob);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Failed to load image as base64: ${error}`);
    }
  };

  return (
    <div>
      <h2>House dummie example:</h2>
      <ul className="flex flex-col gap-y-2 py-7">
        {dummyData.map((house) => (
          <li key={house.id} className="flex gap-x-8">
            <div>{`ID: ${house.id}`}</div>
            <div>{house.contactPerson}</div>
            <div>{house.size}</div>
            <button onClick={() => setSelectedHouse(house)}>Mark for PDF-generation</button>
          </li>
        ))}
      </ul>
      {selectedHouse && <h3 className="mb-3 font-bold">Generate PDF</h3>}

      <div className="flex gap-x-3">
        {selectedHouse && (
          <button
            className="px-5 py-3 bg-red-500 text-white"
            onClick={handleGeneratePDF}
            disabled={!selectedHouse}
          >
            {[`Generate PDF for house ID: ${selectedHouse.id}`]}
          </button>
        )}
        {selectedHouse && (
          <button className="underline" onClick={() => setSelectedHouse(null)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Houses;
