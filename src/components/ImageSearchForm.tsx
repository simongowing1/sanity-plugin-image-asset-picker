import { TextInput, Flex, Button, Text } from "@sanity/ui"
import { FormEvent } from "react"

interface ImageSearchFormProps {
    onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onSearchChange: (event: FormEvent<HTMLInputElement>) => void;
    searchString: string | null;
}

export const ImageSearchForm = (props: ImageSearchFormProps) => {
    const { onSearchSubmit, onSearchChange, searchString } = props;

    return (
        <form onSubmit={onSearchSubmit}>
            <Flex direction={'column'} gap={2}>
                <TextInput
                    width={'fill'}
                    type="text"
                    value={searchString || ''}
                    onChange={onSearchChange}
                    placeholder="Search for images by filename"
                />
                <Button type="submit" mode="ghost" padding={3} width={'fill'}>
                    <Flex justify="center" align="center">
                        <Text size={1}>Search</Text>
                    </Flex>
                </Button>
            </Flex>
        </form>
    )
}