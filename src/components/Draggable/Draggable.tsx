import { useState } from "react";
import { ChevronRight, Strikethrough, X } from "lucide-react";
import useTaskStore, { Task } from "../../store/useTaskStore";
import { Accordion, AccordionDetails, AccordionSummary, Tooltip } from "@mui/material";
import styled from "styled-components";
import { FlexEnd, FlexStart } from "../../common/styles";
import { Tag } from "../../store/useTagStore";
import EditTaskModal from "../Modals/Edit/EditTaskModal";
import { formatPlainText } from "../../common/helpers";


interface DraggableProps {
    onDragEnd?: () => void;
    index: number;
    onDragOver: (index: number) => void;
    item: Task;
    currentColumnId: string;
    setFromColumnId: (toColumnId: string) => void;
    setFromIndex: (index: number) => void;
    hoverIndex: number | null;
}

const DraggableContainer = styled.div<{ $isDragging: boolean; $isHovered: boolean }>`
    cursor: grab;
    padding: 0.5rem;
    margin: 0.5rem;
    background-color: #fef3c6;
    border: 1px solid #00000022;
    border-radius: 0.1rem 0.1rem 0.5rem 0.5rem;
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
    border-top: ${({ $isHovered }) => ($isHovered ? "4px solid #3b82f6" : "1px solid #00000022")};
    margin-top: ${({ $isHovered }) => ($isHovered ? "0.25rem" : "0.5rem")};
`;

const Header = styled.div`
  display: flex;
`;

export const DraggableButton = styled.button<{ type?: string }>`
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    color: inherit;
    border: none;
    background: none;
    width: fit-content;
    &:hover {
        color: ${({ type }) => type === 'delete' ? "#ef4444" : "#99a1af"};
    }
`;

const TagContainer = styled.div<{ color: string }>`
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

const DraggableTitle = styled.h3`
    font-family: 'Oswald', sans-serif; 
    letter-spacing: 0.025rem;
    font-size: 1.15rem;
    font-weight: 500;
    overflow-wrap: break-word;
    margin: 0;
    span {
        margin: 0;
    }
`;

const DraggableBody = styled.div`
  white-space: normal;
  overflow-wrap: break-word;
  line-height: 1.5;

  a {
    color: #2563eb;
    text-decoration: underline;
    &:hover {
      color: #1d4ed8;
    }
  }
`;

const DraggableTags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.5rem;
`;
const ParagraphStyle = styled.p`
  font-size: 0.875rem;
  `

export default function Draggable({ onDragEnd, item, onDragOver, index, currentColumnId, setFromColumnId, setFromIndex, hoverIndex }: DraggableProps) {
    const [isDragging, setIsDragging] = useState(false);
    const strike = item.strike;
    const isOpen = item.isOpen ?? true;
    const { deleteTask, updateTask } = useTaskStore();

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setFromIndex(index);
        setFromColumnId(currentColumnId);

        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
        setIsDragging(true);
        setTimeout(() => e.dataTransfer.setDragImage(new Image(), 0, 0), 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (onDragOver) {
            onDragOver(index);
        }
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
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            $isDragging={isDragging}
            $isHovered={false}
        >
            <Header>
                <FlexStart>
                    <Tooltip title={isOpen ? "Collapse" : "Expand"} placement="top">
                        <DraggableButton onClick={handleCollapse}>
                            <AnimatedChevronRight $isOpen={isOpen} />
                        </DraggableButton>
                    </Tooltip>
                </FlexStart>
                <FlexEnd>
                    <Tooltip title="Strike" placement="top">
                        <DraggableButton onClick={handleStrike}>
                            <Strikethrough className="w-5" />
                        </DraggableButton>
                    </Tooltip>
                    <EditTaskModal task={item} />
                    <Tooltip title="Delete" placement="top">
                        <DraggableButton onClick={handleDelete} type="delete">
                            <X className="w-5" />
                        </DraggableButton>
                    </Tooltip>
                </FlexEnd>
            </Header>
            <Accordion
                expanded={isOpen}
                disableGutters
                elevation={0}
                square
                sx={{
                    background: "none", border: "none", boxShadow: "none", "&::before": {
                        display: "none", padding: 0
                    },
                }}
            >
                <AccordionSummary
                    id={`panel-${item.id}`}
                    sx={{
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        display: "block",
                        padding: "0.25rem 0",
                        margin: 0,
                        pointerEvents: "none",
                        "& .MuiAccordionSummary-content": {
                            margin: 0,
                        },
                    }}
                >
                    <DraggableTitle>
                        {strike ? <s>{item.title}</s> : item.title}
                    </DraggableTitle>
                </AccordionSummary>
                <AccordionDetails style={{ padding: 0, margin: 0 }}>
                    <DraggableBody
                        dangerouslySetInnerHTML={{
                            __html: strike
                                ? `<s>${formatPlainText(item.text)}</s>`
                                : formatPlainText(item.text),
                        }}
                    />
                </AccordionDetails>
            </Accordion>

            <DraggableTags className="mt-2 gap-1 flex flex-wrap">
                {item.tags?.map((t: Tag, k: number) => (
                    <TagContainer key={k} color={t.color}>
                        {t.name}
                    </TagContainer>
                ))}
            </DraggableTags>
        </DraggableContainer>
    );
}
