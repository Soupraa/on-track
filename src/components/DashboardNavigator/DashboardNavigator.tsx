import React, { useEffect } from "react";
import useDashboardStore from "../../store/useDashboardStore";
import { DashboardButton, DashboardList, Title, TopbarContainer } from "./DashboardNavigator.styles";
import Dashboard from "../Dashboard/Dashboard";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import AddNewDashboardModal from "../Modals/Add/AddNewDashboardModal";
import useTaskStore from "../../store/useTaskStore";
import { Spacer } from "../../common/styles";

const DashboardNavigator: React.FC = () => {
    const {
        initializeDashboards,
        dashboards,
        currentDashboardId,
        setActiveDashboard,
        setDashboardToEdit,
        dashboardToEditId,
    } = useDashboardStore();

    const { loadTasksByDashboardId } = useTaskStore();

    useEffect(() => {
        initializeDashboards();
    }, [])

    const handleDashboardChange = (dashboardId: string) => {
        setActiveDashboard(dashboardId);
        loadTasksByDashboardId(dashboardId);
    };

    useEffect(() => {
        window.electronAPI?.onContextMenuCommand(({ action, id }) => {
            setDashboardToEdit(id);
            if (action === "edit") {
                // setShowEditDashboardModal(true);
            } else if (action === "delete") {
                // setShowDeleteDashboardModal(true);
            }
        });
    }, []);
    return (
        <TopbarContainer>
            <Spacer $space={"2rem"}/>
            <DashboardList>
                {dashboards.map((d) => (
                    <DashboardButton
                        key={d.id}
                        title="right click to edit"
                        $isActive={currentDashboardId === d.id}
                        onClick={() => handleDashboardChange(d.id)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            window.electronAPI?.showContextMenu(d.id);
                        }}
                    >
                        {d.title}
                    </DashboardButton>
                ))}
                {dashboards.length < 6 && <AddNewDashboardModal />}

            </DashboardList>
            {currentDashboardId && dashboards.length > 0 && (
                <div className="h-dvh">
                    <Dashboard dashboardId={currentDashboardId} />
                </div>
            )}
        </TopbarContainer>
    )
}
export default DashboardNavigator;