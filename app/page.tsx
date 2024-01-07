"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Link,
  Skeleton,
  Chip,
  Tooltip,
} from "@nextui-org/react";

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [qrCodes, setQrCodes] = React.useState<
    Array<{
      urlExtension: string;
      pointsTo: string;
      timesScanned: number;
      createdAt: string;
      qrCodeImage: {
        type: "Buffer";
        data: number[];
      };
    }>
  >([]);

  React.useEffect(() => {
    const fetchQrCodes = async () => {
      try {
        const response = await fetch("/api/qr");
        const parsedInfo = (await response.json()) as {
          error: boolean;
          qrCodes: Array<{
            urlExtension: string;
            pointsTo: string;
            timesScanned: number;
            createdAt: string;
            qrCodeImage: {
              type: "Buffer";
              data: number[];
            };
          }>;
        };
        const codes = parsedInfo.qrCodes;

        setQrCodes(codes);
      } catch (err) {
        console.log("Error: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrCodes();
  }, []);

  // TODO: Pagination since it gets VERY laggy once we pass like 100 qr codes

  const loadingSkeleton = [1, 2, 3].map((balls, bigballs) => {
    return (
      <Card className="py-4" key={bigballs}>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start space-y-3">
          <Skeleton isLoaded={!isLoading} className="rounded-lg">
            <p className="text-tiny uppercase font-bold">
              Points to{" "}
              <Link href="https://google.com/" size="sm" color="secondary">
                google.com
              </Link>
            </p>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} className="rounded-lg">
            <p className="text-tiny uppercase font-bold">
              Visited <b>1,234</b> times.
            </p>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} className="rounded-lg">
            <p className="text-tiny uppercase font-bold">
              Created on <b>4/20/69</b>{" "}
            </p>
          </Skeleton>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Skeleton isLoaded={!isLoading} className="py-[4rem] rounded-lg">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              width={270}
            />
          </Skeleton>
        </CardBody>
      </Card>
    );
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gridTemplateRows: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1rem",
      }}
    >
      {isLoading
        ? loadingSkeleton
        : qrCodes.map((qrCode, key) => (
            <Card className="py-4" key={key}>
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="text-tiny uppercase font-bold">
                  Points to:{"  "}
                  <Tooltip
                    content={
                      <Link href={qrCode.pointsTo}>{qrCode.pointsTo}</Link>
                    }
                  >
                    <Chip color="secondary" size="sm" variant="dot">
                      {new URL(qrCode.pointsTo).hostname}
                    </Chip>
                  </Tooltip>
                </div>
                <div className="text-tiny uppercase font-bold py-2">
                  Visited <b>{qrCode.timesScanned}</b> times.
                </div>
                <div className="text-tiny uppercase font-bold py-1">
                  Created on:{" "}
                  <b>
                    {new Date(qrCode.createdAt).toLocaleDateString()} @{" "}
                    {new Date(qrCode.createdAt).toLocaleTimeString()}
                  </b>{" "}
                </div>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt="QR Code Image"
                  className="object-cover rounded-xl"
                  src={`data:image/png;base64,${Buffer.from(
                    qrCode.qrCodeImage.data
                  ).toString("base64")}`}
                  width={500}
                />
              </CardBody>
            </Card>
          ))}
    </div>
  );
}
