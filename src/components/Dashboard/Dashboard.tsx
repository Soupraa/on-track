import { useEffect } from "react";
import styled from "styled-components";
import useTaskStore, { Task } from "../../store/useTaskStore";
import useTagStore from "../../store/useTagStore";
import Column from "../Column/Column";
import Draggable from "../Draggable/Draggable";
import Toolbar from "../Toolbar/Toolbar";
import { COLOR } from "../../common/styles";

interface DashboardProps {
    dashboardId: string;
}

const DashboardContainer = styled.div`
    display: flex;
    height: 100%;
    background: ${COLOR.MAIN_BACKGROUND};
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 0 auto;
`;

const ParagraphStyle = styled.p`
  font-size: 0.875rem; /* Equivalent to text-sm */
`;

export default function Dashboard({ dashboardId }: DashboardProps) {
    const { columns, moveTask, loadTasksByDashboardId } = useTaskStore();
    const { getDashboardTags, currentTags } = useTagStore();

    useEffect(() => {
        loadTasksByDashboardId(dashboardId);
        getDashboardTags(dashboardId);
    }, [dashboardId]);

    return (
        <DashboardContainer>
            <Toolbar tagsArr={currentTags} />
            {/* <MainContent> */}
                {columns && (
                    <>
                        <Column
                            id="todo"
                            title="To Do"
                            onDrop={(itemId: string) => moveTask(itemId, "todo")}
                            count={columns.todo.length}
                        >
                            {columns.todo.map((item: Task) => (
                                <Draggable key={item.id} item={item}>
                                    <ParagraphStyle>{item.text}</ParagraphStyle>
                                </Draggable>
                            ))}
                        </Column>

                        <Column
                            id="progress"
                            title="In Progress"
                            onDrop={(itemId: string) => moveTask(itemId, "progress")}
                            count={columns.progress.length}
                        >
                            {columns.progress.map((item: Task) => (
                                <Draggable key={item.id} item={item}>
                                    <ParagraphStyle>{item.text}</ParagraphStyle>
                                </Draggable>
                            ))}
                        </Column>

                        <Column
                            id="done"
                            title="Done"
                            onDrop={(itemId: string) => moveTask(itemId, "done")}
                            count={columns.done.length}
                        >
                            {columns.done.map((item: Task) => (
                                <Draggable key={item.id} item={item}>
                                    <ParagraphStyle>{item.text}</ParagraphStyle>
                                </Draggable>
                            ))}
                        </Column>
                    </>
                )}
            {/* </MainContent> */}
        </DashboardContainer>
    );
}
