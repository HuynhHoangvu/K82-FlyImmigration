import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Sentry sẽ tự capture nếu được init trước ErrorBoundary
    console.error('[ErrorBoundary]', error.message, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={styles.title}>Có lỗi xảy ra</Text>
        <Text style={styles.subtitle}>
          Ứng dụng gặp sự cố không mong muốn.{'\n'}Vui lòng thử lại.
        </Text>
        {__DEV__ && this.state.error && (
          <Text style={styles.devError}>{this.state.error.message}</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
          <Text style={styles.buttonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1117',
    padding: 24,
  },
  emoji: { fontSize: 56, marginBottom: 16 },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8b949e',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  devError: {
    color: '#f85149',
    fontSize: 11,
    fontFamily: 'monospace',
    backgroundColor: '#161b22',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    maxWidth: '100%',
  },
  button: {
    backgroundColor: '#fdd52f',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: { color: '#0d1117', fontWeight: 'bold', fontSize: 15 },
})
