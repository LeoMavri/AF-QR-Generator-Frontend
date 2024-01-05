"use client";

import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, HeartFilledIcon } from "@/components/icons";

import { Logo } from "@/components/icons";

export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [getUrl, setUrl] = React.useState<string>("");
  const [getCorrectionLevel, setCorrectionLevel] = React.useState<string>("");
  const [getVersion, setVersion] = React.useState<number>(-1);
  const [getMaskPattern, setMaskPattern] = React.useState<number>(-1);

  const postData = async () => {
    try {
      const response = await fetch("/api/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pointsTo: getUrl,
          errorCorrectionLevel: getCorrectionLevel || "low",
          version: getVersion === -1 ? undefined : getVersion,
          maskPattern: getMaskPattern === -1 ? undefined : getMaskPattern,
        }),
      });

      const parsedInfo: {
        error: boolean;
      } = await response.json();

      if (parsedInfo.error) {
        alert(`Failed to create QR Code. Check console for more info.`);
        console.warn(parsedInfo);
      } else {
        alert(`Successfully created QR Code!`);
      }
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2_500));
      window.location.reload();
    }
  };

  const isInvalidURL = React.useMemo(() => {
    if (getUrl === "") return true;
    try {
      new URL(getUrl);
      return false;
    } catch {
      return true;
    }
  }, [getUrl]);

  const isInvalidVersion = React.useMemo(() => {
    if (getVersion === -1) return false;
    if (isNaN(getVersion)) return true;
    if (!getVersion) return false;
    if (getVersion >= 1 && getVersion <= 40) return false;
    return true;
  }, [getVersion]);

  const isInvalidMaskPattern = React.useMemo(() => {
    if (getMaskPattern === -1) return false;
    if (isNaN(getMaskPattern)) return true;
    if (!getMaskPattern && getMaskPattern !== 0) return false;
    if (getMaskPattern >= 0 && getMaskPattern <= 7) return false;
    return true;
  }, [getMaskPattern]);

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">QR Code Generator</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.github} aria-label="Github">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden md:flex">
          {/* ! This is the button I care about */}
          <Button
            className="text-sm font-normal text-default-600 bg-default-100"
            startContent={<HeartFilledIcon className="text-danger" />}
            onClick={onOpen}
            variant="flat"
          >
            Create QR Code
          </Button>

          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Settings
                  </ModalHeader>
                  <ModalBody>
                    {/* Input for URL */}
                    <Input
                      label="URL to encode"
                      placeholder="https://example.com"
                      type="url"
                      variant="bordered"
                      isClearable
                      description="Enter the URL you want to encode into a QR Code."
                      isRequired
                      width="100%"
                      color={isInvalidURL ? "danger" : "success"}
                      errorMessage={isInvalidURL && "Please enter a valid URL."}
                      onValueChange={setUrl}
                    />
                    {/* Button for Correction Level (enum -> Dropdown) */}
                    <Dropdown backdrop="blur">
                      <DropdownTrigger>
                        <Button variant="bordered">Set Correction Level</Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Static Actions"
                        onAction={(key): void =>
                          setCorrectionLevel(key.toString())
                        }
                      >
                        <DropdownItem key="low" description="Up to 7% damage.">
                          Low
                        </DropdownItem>
                        <DropdownItem
                          key="medium"
                          description="Up to 15% damage."
                        >
                          Medium
                        </DropdownItem>
                        <DropdownItem
                          key="quartile"
                          description="Up to 25% damage."
                        >
                          Quartile
                        </DropdownItem>
                        <DropdownItem
                          key="high"
                          description="Up to 30% damage."
                        >
                          High
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    <div className="flex flex-col md:flex-row ">
                      {/* Input for QR Code Version (1->40) */}
                      <div className="md:w-1/2 md:pr-4">
                        <Input
                          label="QR Code Version"
                          placeholder="1-40"
                          type="number"
                          variant="bordered"
                          isClearable
                          description="Leave empty to auto-detect."
                          onValueChange={(value) => setVersion(Number(value))}
                          color={isInvalidVersion ? "danger" : "success"}
                          errorMessage={
                            isInvalidVersion &&
                            "Please enter a valid QR Code version."
                          }
                        />
                      </div>
                      {/* Input for Mask Pattern (0->7) */}
                      <div className="md:w-1/2 md:ml-auto">
                        <Input
                          label="Mask Pattern"
                          placeholder="0-7"
                          type="number"
                          variant="bordered"
                          isClearable
                          description="Leave empty to auto-detect."
                          // width="100%"
                          onValueChange={(value) =>
                            setMaskPattern(Number(value))
                          }
                          color={isInvalidMaskPattern ? "danger" : "success"}
                          errorMessage={
                            isInvalidMaskPattern &&
                            "Please enter a valid mask pattern."
                          }
                        />
                      </div>{" "}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={onClose}>
                      Close
                    </Button>

                    {/* TODO: Some pop over stuff here ig */}
                    <Button
                      color="primary"
                      onPress={postData}
                      disabled={
                        isInvalidURL || isInvalidVersion || isInvalidMaskPattern
                      }
                    >
                      Create
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github} aria-label="Github">
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
    </NextUINavbar>
  );
};
