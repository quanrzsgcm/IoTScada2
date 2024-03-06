const BooksButton = () => {
    const record = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/authors/${record.id}/books`}
            color="primary"
        >
            Books
        </Button>
    );
};

export const AuthorList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <BooksButton />
        </Datagrid>
    </List>
);