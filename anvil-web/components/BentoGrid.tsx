import React from "react";
import PuzzlePieces from "./PuzzlePiece";

export default function BentoGrid() {
  return (
    <div className="min-h-screen bg-black py-20 font-neue-montreal px-5">
      <div className="w-full mx-auto flex flex-col items-center justify-center">
        <h1 className="text-6xl max-w-3xl font-medium text-center text-white mb-20">
          The tool we wish we had, so we built it for you
        </h1>

        <div className="grid grid-cols-5 grid-rows-2 gap-4 h-[50rem] w-full">
          {/* Grid Item 1 - Top Left (Square) */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col col-span-2 row-span-1 justify-end px-6 pt-6 pb-10">
            <div className="absolute inset-0 z-0">
              <PuzzlePieces />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.6),_transparent_70%)] z-10 pointer-events-none" />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-medium text-white mb-2">
                Modular Stack Building
              </h2>
              <p className="text-zinc-400 text-sm font-medium max-w-sm mx-auto">
                Pick your stack components like it's a buffet. React? Next?
                Prisma? Express? Tailwind? Yes to all. Or just some.
              </p>
            </div>
          </div>

          {/* Grid Item 2 - Top Right (Rectangular - spans 3 columns) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col col-span-3 row-span-1">
            <div className="flex-1 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-purple-600 text-3xl">🎨</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Second Grid
              </h2>
              <p className="text-gray-600 text-xs">
                This grid spans horizontally across multiple columns
              </p>
            </div>
          </div>

          {/* Grid Item 3 - Bottom Left (Rectangular - spans 3 columns) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col col-span-1 row-span-1">
            <div className="flex-1 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-green-600 text-3xl">🌱</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Third Grid
              </h2>
              <p className="text-gray-600 text-xs">
                Another horizontally extended grid item
              </p>
            </div>
          </div>

          {/* Grid Item 4 - Bottom Right (Square) */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col col-span-2 row-span-1">
            <div className="flex-1 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-orange-600 text-3xl">⚡</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Fourth Grid
              </h2>
              <p className="text-gray-600 text-xs">Square grid item</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col col-span-2 row-span-1">
            <div className="flex-1 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-orange-600 text-3xl">⚡</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Fourth Grid
              </h2>
              <p className="text-gray-600 text-xs">Square grid item</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
