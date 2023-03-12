import React, { Component } from "react";

import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import { API, Storage } from "aws-amplify";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
    };
  }

  componentDidMount() {
    this.fetchNotes();
  }

  async fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    this.setState({ notes: notesFromAPI });
  }

  async createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    this.fetchNotes();
    event.target.reset();
  }

  async deleteNote({ id, name }) {
    const { notes } = this.state;
    const newNotes = notes.filter((note) => note.id !== id);
    this.setState({ notes: newNotes });
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  render() {
    const { signOut } = this.props;
    const { notes } = this.state;
    return (
      <View className="App">
        <Heading level={1}>My Notes App</Heading>
        <View as="form" margin="3rem 0" onSubmit={this.createNote}>
          <Flex direction="row" justifyContent="center">
            <TextField
              name="name"
              placeholder="Note Name"
              label="Note Name"
              labelHidden
              variation="quiet"
              required
            />
            <TextField
              name="description"
              placeholder="Note Description"
              label="Note Description"
              labelHidden
              variation="quiet"
              required
            />
            <View
              name="image"
              as="input"
              type="file"
              style={{ alignSelf: "end" }}
            />
            <Button type="submit" variation="primary">
              Create Note
            </Button>
          </Flex>
        </View>
        <Heading level={2}>Current Notes</Heading>
        <View margin="3rem 0">
          {notes.map((note) => (
            <Flex
              key={note.id || note.name}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Text as="strong" fontWeight={700}>
                {note.name}
              </Text>
              <Text as="span">{note.description}</Text>
              {note.image && (
                <Image
                  src={note.image}
                  alt={`visual aid for ${notes.name}`}
                  style={{ width: 400 }}
                />
              )}
              <Button variation="link" onClick={() => this.deleteNote(note)}>
                Delete note
              </Button>
            </Flex>
          ))}
        </View>
        <Button onClick={signOut}>Sign Out</Button>
      </View>
    );
  }
}

export default withAuthenticator(App);
