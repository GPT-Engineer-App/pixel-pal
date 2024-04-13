import React, { useState } from "react";
import { ChakraProvider, Box, VStack, Heading, FormControl, FormLabel, Input, Button, Textarea, useToast, Container, IconButton, HStack, StackDivider, Text } from "@chakra-ui/react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

// Fake API functions to simulate backend interaction
const api = {
  login: async (email, password) => {
    // Placeholder for login API call
    return { accessToken: "fake-access-token" };
  },
  signup: async (email, password) => {
    // Placeholder for signup API call
  },
  getPosts: async () => {
    // Placeholder for fetching posts API call
    return [
      { id: "1", title: "First Post", content: "This is the first post content." },
      { id: "2", title: "Second Post", content: "This is the second post content." },
    ];
  },
  createPost: async (title, content) => {
    // Placeholder for creating a new post API call
  },
  updatePost: async (id, title, content) => {
    // Placeholder for updating a post API call
  },
  deletePost: async (id) => {
    // Placeholder for deleting a post API call
  },
};

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const toast = useToast();

  const fetchPosts = async () => {
    const fetchedPosts = await api.getPosts();
    setPosts(fetchedPosts);
  };

  const handleLogin = async () => {
    try {
      const response = await api.login(email, password);
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      fetchPosts();
      toast({ title: "Logged in successfully!", status: "success" });
    } catch (error) {
      toast({ title: "Failed to log in.", description: error.message, status: "error" });
    }
  };

  const handleSignup = async () => {
    try {
      await api.signup(email, password);
      setEmail("");
      setPassword("");
      toast({ title: "Signed up successfully!", status: "success" });
    } catch (error) {
      toast({ title: "Failed to sign up.", description: error.message, status: "error" });
    }
  };

  const handleCreateOrUpdatePost = async () => {
    if (editingPost) {
      await api.updatePost(editingPost.id, title, content);
      setEditingPost(null);
    } else {
      await api.createPost(title, content);
    }
    setTitle("");
    setContent("");
    fetchPosts();
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleDeletePost = async (id) => {
    await api.deletePost(id);
    fetchPosts();
  };

  const authenticationForm = (
    <VStack spacing={4}>
      <FormControl id="email" isRequired>
        <FormLabel>Email address</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <HStack spacing={4}>
        <Button colorScheme="blue" onClick={handleLogin}>
          Login
        </Button>
        <Button colorScheme="green" onClick={handleSignup}>
          Signup
        </Button>
      </HStack>
    </VStack>
  );

  const postForm = (
    <VStack spacing={4} divider={<StackDivider />}>
      <FormControl id="title" isRequired>
        <FormLabel>Title</FormLabel>
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>
      <FormControl id="content" isRequired>
        <FormLabel>Content</FormLabel>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </FormControl>
      <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleCreateOrUpdatePost}>
        {editingPost ? "Update Post" : "Create Post"}
      </Button>
    </VStack>
  );

  const postsList = posts.map((post) => (
    <HStack key={post.id} spacing={4}>
      <VStack align="start">
        <Heading size="md">{post.title}</Heading>
        <Text>{post.content}</Text>
      </VStack>
      <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEditPost(post)} />
      <IconButton aria-label="Delete" icon={<FaTrashAlt />} onClick={() => handleDeletePost(post.id)} />
    </HStack>
  ));

  return (
    <ChakraProvider>
      <Container maxW="container.md" py={10}>
        <VStack spacing={10}>
          {!isLoggedIn ? authenticationForm : postForm}
          {isLoggedIn && (
            <VStack spacing={4} divider={<StackDivider />}>
              {postsList}
            </VStack>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
};

export default Index;
