"use client";

import { LocationResponse } from "@app/api/location/route";
import Button from "@comps/UI/button/button";
import Modal from "@comps/UI/modal/modal";
import { revokeOtherSessions, revokeSession } from "@lib/authClient";
import { SessionList } from "@lib/authServer";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Fragment, ReactNode, createContext, useContext, useState } from "react";
import { getBrowser, getOs, locationString } from "./utils";

export type SessionAndLocation = {
    session: SessionList[number];
    location: LocationResponse;
};

type ContextType = {
    data: SessionAndLocation[];
    setData: Dispatch<SetStateAction<SessionAndLocation[]>>;
};

const Context = createContext<ContextType>({} as ContextType);

type ProviderProps = {
    init: SessionAndLocation[];
    children: ReactNode;
};

const Provider = (props: ProviderProps) => {
    const { init, children } = props;
    const [data, setData] = useState<SessionAndLocation[]>(init);
    return <Context.Provider value={{ data, setData }}>{children}</Context.Provider>;
};

type SessionManagerProps = {
    sessionAndLocationList: SessionAndLocation[];
};

export default function SessionManager(props: SessionManagerProps) {
    const { sessionAndLocationList: init } = props;
    return (
        <Provider init={init}>
            <DisplaySessionList />
        </Provider>
    );
}

const DisplaySessionList = () => {
    const { data, setData } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="space-y-2">
            <div className="flex flex-row items-baseline justify-between">
                <div className="text-lg font-bold">Autres appareils</div>
                {/* Revoke other sessions button */}
                {data.length ? (
                    <Button
                        label="Revoquer les sessions"
                        variant="underline"
                        className={{ button: "text-sm" }}
                        onClick={() => setIsModalOpen(true)}
                    />
                ) : (
                    <></>
                )}
                {/* Revoke other sessions modal */}
                <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} withCloseButton>
                    <div className="flex flex-col gap-4">
                        <div className="text-xl font-bold">Déconnexion globale</div>
                        <div className="text-sm">Souhaitez-vous vraiment déconnecter toutes vos autres sessions ?</div>
                        <div className="flex flex-row justify-center gap-2">
                            <Button label="Annuler" variant="outline" onClick={() => setIsModalOpen(false)} />
                            <Button
                                label="Déconnecter"
                                variant="default"
                                onClick={() => {
                                    revokeOtherSessions();
                                    setIsModalOpen(false);
                                    setData([]);
                                }}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
            {/* Other sessions list */}
            <div className="border-gray-light space-y-2 rounded-lg border px-5 py-3">
                {data.length ? (
                    data.map((sessionAndLocation, index) => (
                        <Fragment key={index}>
                            {index > 0 && <hr className="border-gray-light" />}
                            <SessionItem sessionAndLocation={sessionAndLocation} />
                        </Fragment>
                    ))
                ) : (
                    <div className="text-gray-middle text-center text-sm">Aucune autre session n&apos;est active.</div>
                )}
            </div>
        </div>
    );
};

type SessionItemProps = {
    sessionAndLocation: SessionAndLocation;
};

const SessionItem = (props: SessionItemProps) => {
    const { sessionAndLocation } = props;
    const { session, location } = sessionAndLocation;

    const { setData } = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userAgent = session.userAgent ?? "";
    const formattedDate = new Date(session.updatedAt).toLocaleString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const formattedTime = new Date(session.updatedAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="flex flex-row items-center justify-between gap-4">
            {/* Session item */}
            <div className="flex w-full flex-row items-center gap-3">
                <div className="size-2 rounded-full bg-green-500" />
                <div className="flex w-full flex-row items-center justify-between gap-3">
                    <div className="text-sm">
                        <div className="font-semibold">{`${getBrowser(userAgent)} • ${getOs(userAgent)}`}</div>
                        <div className="text-2xs text-gray-middle line-clamp-1 w-full">{locationString(location)}</div>
                    </div>
                    <div className="text-gray-middle text-right">
                        <div className="text-2xs">Dernière activité le </div>
                        <div className="text-xs text-nowrap">
                            <span className="font-semibold">{formattedDate}</span>
                            <span> à </span>
                            <span className="font-semibold">{formattedTime}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Revoke this session button */}
            <Button
                label={`Déconnecter la session du ${formattedDate} à ${formattedTime}`}
                variant="outline"
                className={{ button: "rounded-md p-1.5" }}
                onClick={() => setIsModalOpen(true)}
            >
                <X className="size-4" />
            </Button>
            {/* Revoke this session modal */}
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} withCloseButton>
                <div className="flex flex-col items-center gap-4">
                    <div className="text-xl font-bold">Déconnexion</div>
                    <div className="flex flex-row justify-center">
                        <div className="border-gray-light w-fit rounded-lg border px-7 py-2 text-center">
                            <div className="text-xs">Dernière activité le</div>
                            <div className="text-sm font-semibold">
                                {formattedDate} à {formattedTime}
                            </div>
                        </div>
                    </div>
                    <div className="text-sm">Souhaitez-vous vraiment déconnecter cette session ?</div>
                    <div className="flex flex-row justify-center gap-2">
                        <Button label="Annuler" variant="outline" onClick={() => setIsModalOpen(false)} />
                        <Button
                            label="Déconnecter"
                            variant="default"
                            onClick={() => {
                                revokeSession({ token: session.token });
                                setIsModalOpen(false);
                                setData((prevData: SessionAndLocation[]) =>
                                    prevData.filter((item: SessionAndLocation) => item.session.token !== session.token),
                                );
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
