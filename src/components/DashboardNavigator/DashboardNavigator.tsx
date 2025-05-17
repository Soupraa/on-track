import React, { useEffect, useState } from "react";
import useDashboardStore from "../../store/useDashboardStore";
import { DashboardButton, DashboardList, TopbarContainer } from "./DashboardNavigator.styles";
import Dashboard from "../Dashboard/Dashboard";
import AddNewDashboardModal from "../Modals/Add/AddNewDashboardModal";
import useTaskStore from "../../store/useTaskStore";
import { Spacer } from "../../common/styles";
import EditDashboardModal from "../Modals/Edit/EditDashboardModal";
import DeleteDashboardModal from "../Modals/Delete/DeleteDashboardModal";

const DashboardNavigator: React.FC = () => {
    const {
        initializeDashboards,
        dashboards,
        currentDashboardId,
        setActiveDashboard,
        setDashboardToEdit,
    } = useDashboardStore();

    const { loadTasksByDashboardId } = useTaskStore();
    const [showEditDashboardModal, setShowEditDashboardModal] = useState(false);
    const [showDeleteDashboardModal, setShowDeleteDashboardModal] = useState(false);

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
                setShowEditDashboardModal(true);
            } else if (action === "delete") {
                setShowDeleteDashboardModal(true);
            }
        });
    }, []);
    return (
        <TopbarContainer>
            {showEditDashboardModal && (
                <EditDashboardModal
                    showModal={showEditDashboardModal}
                    setShowModal={setShowEditDashboardModal}
                />
            )}
            {showDeleteDashboardModal && (
                <DeleteDashboardModal
                    showModal={showDeleteDashboardModal}
                    setShowModal={setShowDeleteDashboardModal}
                />
            )}
            <Spacer $space={"2rem"} />
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
                <Dashboard dashboardId={currentDashboardId} />
            )}
        </TopbarContainer>
    )
}
export default DashboardNavigator;