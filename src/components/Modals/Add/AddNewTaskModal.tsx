import { useState } from "react";
import ModalWrapper from "../../ModalWrapper/ModalWrapper";
import { ErrorText, Form, FormDropdown, FormItem, Input, Label, ModalTitle, NewTaskButton, TextArea, Option } from "../Modal.styles";
import { isValidLength } from "../../../common/helpers";
import ModalButtonGroup from "../../ModalButtonGroup/ModalButtonGroup";
import { Spacer } from "../../../common/styles";
import { COLUMNS } from "../../../common/constants";
import useTaskStore from "../../../store/useTaskStore";
import { TagSelector } from "../../TagSelector/TagSelector";
import useTagStore, { Tag } from "../../../store/useTagStore";

export default function AddNewTaskModal() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [activeColumn, setActiveColumn] = useState(COLUMNS.TODO);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const { addTask } = useTaskStore();
    const { currentTags } = useTagStore();


    const handleOpen = () => {
        setTitle("");
        setTitleError("");
        setDescription("");
        setDescriptionError("");
        setSelectedTags([]);
        setOpen(true);

    }
    const handleClose = () => {
        setTitle("");
        setTitleError("");
        setDescription("");
        setDescriptionError("");
        setSelectedTags([]);
        setOpen(false);
    }
    const handleSubmit = async (e: any) => {    
        e.preventDefault();
        if (!title.trim()) {
            setTitleError("Name is required.");
            return;
        }
        if (!isValidLength(title, 30)) {
            setTitleError("Name cannot exceed 30 character limit.");
            return;
        }
        if (!isValidLength(description, 500)) {
            setDescriptionError("Description cannot exceed 500 character limit.");
            return;
        }
        addTask(activeColumn, {
            title: title,
            text: description,
            tags: selectedTags,
        });
        handleClose();
    }
    return (
        <>
            <NewTaskButton
                onClick={handleOpen}
            >
                New Task
            </NewTaskButton>
            <ModalWrapper setIsOpen={setOpen} isOpen={open}>
                <ModalTitle>Add a new dashboard</ModalTitle>
                <Form onSubmit={handleSubmit}>
                    <FormItem>
                        <Label>Name</Label>
                        <Input
                            name="name"
                            type="text"
                            placeholder="Name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {titleError && <ErrorText>{titleError}</ErrorText>}
                    </FormItem>
                    <FormItem>
                        <Label>Description</Label>
                        <TextArea
                            name="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {descriptionError && <ErrorText>{descriptionError}</ErrorText>}
                    </FormItem>
                    <FormItem>
                        <Label>Status</Label>
                        <FormDropdown
                            value={activeColumn}
                            onChange={(e) => setActiveColumn(e.target.value)}
                            className="p-2 border rounded-xl w-full bg-slate-100 mt-2 text-black cursor-pointer"
                        >
                            <Option value="todo">To Do</Option>
                            <Option value="progress">In Progress</Option>
                            <Option value="done">Done</Option>
                        </FormDropdown>

                    </FormItem>
                    <Label>Tag</Label>
                    <TagSelector
                        availableTags={currentTags}
                        selectedTags={selectedTags}
                        onChange={setSelectedTags}
                    />
                    <Spacer $space={"2rem"} />
                    <ModalButtonGroup
                        leftLabel={"Close"}
                        rightLabel={"Add"}
                        closeModalFunc={handleClose}
                    />
                </Form>
            </ModalWrapper>
        </>
    )
}