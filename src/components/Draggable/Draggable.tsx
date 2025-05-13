import { useState, useRef, useEffect } from "react";
import { ChevronRight, Strikethrough, X } from "lucide-react";
import useTaskStore, { Task } from "../../store/useTaskStore";
// import EditItemModal from "./modals/EditItemModal";
import { Accordion, AccordionDetails, AccordionSummary, Tooltip } from "@mui/material";
import styled from "styled-components";
import { FlexEnd, FlexStart } from "../../common/styles";
// import type { Task } from "../types/task"; // Adjust the path to your Task type
// import { Tag } from "../../store/useTagStore";

interface DraggableProps {
    children: React.ReactNode;
    onDragEnd?: () => void;
    item: Task;
}

const DraggableContainer = styled.div<{ $isDragging: boolean }>`
  cursor: grab;
  padding: 0.5rem;
  margin: 0.5rem;
  background-color: #fef3c6;
  border: 1px solid #00000022;
  border-radius: 0.5rem;
  font-family: Inter, sans-serif;
  color: black;
  overflow: visible;
  user-select: none;
  text-align: left;
  box-shadow: ${({ $isDragging }) =>
        $isDragging
            ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
            : "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)"};
  transform: ${({ $isDragging }) => ($isDragging ? "scale(1.02)" : "scale(1)")};
  transition: all 0.2s ease;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.9 : 1)};
`;

const Header = styled.div`
  display: flex;
`;

const Button = styled.button`
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: inherit;
    border: none;
    background: none;
    width: fit-content;
    &:hover {
        color: #ef4444;
    }
`;

const Tag = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  padding: 0.25rem;
  margin: 0.125rem 0.25rem 0 0;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  display: inline-flex;
`;
const AnimatedChevronRight = styled(ChevronRight) <{ $isOpen: boolean }>`
    transform: ${({ $isOpen }) => $isOpen ? "rotate(90deg)" : ""};
      transition: transform 0.2s ease-in-out;
`;
export default function Draggable({ children, onDragEnd, item }: DraggableProps) {
    const [isDragging, setIsDragging] = useState(false);
    const strike = item.strike;
    const isOpen = item.isOpen ?? true;
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const { deleteTask, updateTask } = useTaskStore();

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
        setIsDragging(true);
        setTimeout(() => e.dataTransfer.setDragImage(new Image(), 0, 0), 0);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        if (onDragEnd) onDragEnd();
    };

    const handleDelete = async () => {
        await deleteTask(item.id);
    };

    const handleStrike = async () => {
        await updateTask(item.id, { strike: !strike });
    };

    const handleCollapse = async () => {
        await updateTask(item.id, { isOpen: !isOpen });
    };

    return (
        <DraggableContainer
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            $isDragging={isDragging}
        >
            <Header>
                <FlexStart>
                    <Tooltip title={isOpen ? "Collapse" : "Expand"} placement="top">
                        <Button onClick={handleCollapse}>
                            <AnimatedChevronRight $isOpen={isOpen} />
                        </Button>
                    </Tooltip>
                </FlexStart>
                <FlexEnd>
                    <Tooltip title="Strike" placement="top">
                        <Button onClick={handleStrike}>
                            <Strikethrough className="w-5" />
                        </Button>
                    </Tooltip>
                    {/* <EditItemModal item={item} /> */}
                    <Tooltip title="Delete" placement="top">
                        <Button onClick={handleDelete}>
                            <X className="w-5" />
                        </Button>
                    </Tooltip>
                </FlexEnd>
            </Header>
            <Accordion
                expanded={isOpen}
                onChange={handleCollapse}
                disableGutters
                elevation={0}
                square
                sx={{ background: "none", border: "none", boxShadow: "none" }}
            >
                <AccordionSummary
                    id={`panel-${item.id}`}
                    sx={{
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        display: "block",
                        padding: 0,

                    }}
                >
                    <h3>
                        {strike ? <s>{item.title}</s> : item.title}
                    </h3>
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0 }} sx={{
                    padding: 0,

                }}>

                    {strike ? <s>{children}</s> : children}

                </AccordionDetails>
            </Accordion>

            {/* <div className="mt-2 gap-1 flex flex-wrap">
        {item.tags?.map((t: Tag, k: number) => (
          <Tag key={k} color={t.color}>
            {t.title}
          </Tag>
        ))}
      </div> */}
        </DraggableContainer>
    );
}
